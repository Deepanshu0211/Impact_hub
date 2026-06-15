import { VertexAI, SchemaType, Schema } from "@google-cloud/vertexai";
import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase/admin";

const matchRouteSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    recommended_volunteers: {
      type: SchemaType.ARRAY,
      description: "List of recommended volunteers",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: {
            type: SchemaType.STRING,
            description: "Volunteer ID exactly as provided"
          },
          name: {
            type: SchemaType.STRING,
            description: "Volunteer name"
          },
          match_score: {
            type: SchemaType.INTEGER,
            description: "A matching score from 0-100"
          },
          reasoning: {
            type: SchemaType.STRING,
            description: "Reasoning why this volunteer is a good match"
          },
          estimated_arrival: {
            type: SchemaType.STRING,
            description: "Estimated arrival time"
          },
          assigned_role: {
            type: SchemaType.STRING,
            description: "Assigned role description"
          }
        },
        required: ["id", "name", "match_score", "reasoning", "estimated_arrival", "assigned_role"]
      }
    },
    team_composition_notes: {
      type: SchemaType.STRING,
      description: "Notes about the overall team composition"
    },
    coverage_gaps: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of any skills or resources not covered"
    },
    dispatch_priority_order: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Ordered list of volunteer names to dispatch first"
    }
  },
  required: ["recommended_volunteers", "team_composition_notes", "coverage_gaps", "dispatch_priority_order"]
};

// Initialize Vertex AI
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
const privateKey = rawPrivateKey
  ? rawPrivateKey.replace(/^['"]|['"]$/g, "").replace(/\\n/g, "\n")
  : undefined;

const vertex_ai = new VertexAI({
  project: process.env.FIREBASE_PROJECT_ID || 'impacthub-567ce',
  location: 'us-central1',
  googleAuthOptions: (process.env.FIREBASE_CLIENT_EMAIL && privateKey) ? {
    credentials: {
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: privateKey,
    }
  } : undefined
});
const genAI = vertex_ai;

export async function POST(req: Request) {
  try {
    // Authenticate user via Authorization Header ID Token
    const authHeader = req.headers.get("Authorization");
    let user: any = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const idToken = authHeader.split("Bearer ")[1];
      try {
        user = await adminAuth.verifyIdToken(idToken);
      } catch (e) {
        console.warn("Failed to verify ID token:", e);
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { incident } = await req.json();

    if (!incident) {
      return NextResponse.json({ error: "Missing 'incident' data" }, { status: 400 });
    }

    try {
      let model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: matchRouteSchema
        }
      });
      let usedModel = "gemini-2.5-flash";

      // Fetch volunteers from Firestore
      const volunteersSnap = await adminDb.collection('profiles')
        .where('role', '==', 'volunteer')
        .get();

      const dbVolunteers = volunteersSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

      // Map the database profiles to the format Gemini expects
      const volunteerList = (dbVolunteers || []).map((v: any) => ({
        id: v.id,
        name: v.name || v.metadata?.name || "Unknown Volunteer",
        skills: Array.isArray(v.metadata?.skills) ? v.metadata.skills : (v.metadata?.skills || "").split(",").map((s: string) => s.trim()).filter(Boolean),
        distance_km: v.metadata?.distance_km || 5.0,
        available: v.metadata?.available !== false
      })).filter((v: any) => v.available);

      if (volunteerList.length === 0) {
        return NextResponse.json({ success: true, data: { recommended_volunteers: [], team_composition_notes: "No volunteers available", coverage_gaps: [], dispatch_priority_order: [] } });
      }

      const prompt = `You are a volunteer matching AI for disaster response. Match the best volunteers to this incident.

Incident: ${JSON.stringify(incident)}

Available Volunteers: ${JSON.stringify(volunteerList)}

Return ONLY valid JSON (no markdown, no code fences) with these fields:
{
  "recommended_volunteers": [
    {
      "id": "volunteer id exactly as provided",
      "name": "volunteer name",
      "match_score": 0-100,
      "reasoning": "why this volunteer is a good match",
      "estimated_arrival": "estimated time",
      "assigned_role": "what they should do"
    }
  ],
  "team_composition_notes": "notes about the overall team",
  "coverage_gaps": ["any skills or resources not covered"],
  "dispatch_priority_order": ["ordered list of names to dispatch first"]
}`;

      let result;
      try {
        result = await model.generateContent(prompt);
      } catch (e: any) {
        if (e.message?.includes("503") || e.status === 503) {
          model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: matchRouteSchema
            }
          });
          usedModel = "gemini-2.5-flash-lite";
          result = await model.generateContent(prompt);
        } else {
          throw e;
        }
      }

      const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);

      const validIds = new Set(volunteerList.map((v: any) => v.id));

      if (parsed.recommended_volunteers && Array.isArray(parsed.recommended_volunteers)) {
        const batch = adminDb.batch();
        const validRecommendations = parsed.recommended_volunteers.filter((v: any) => v.id && validIds.has(v.id));

        validRecommendations.forEach((v: any) => {
          const notifRef = adminDb.collection('notifications').doc();
          batch.set(notifRef, {
            id: notifRef.id,
            user_id: v.id,
            type: "alert",
            title: "AI Auto-Dispatch Priority Match",
            body: `You have been prioritized for a mission. Recommended role: ${v.assigned_role}. Match reasoning: ${v.reasoning}`,
            read: false,
            created_at: new Date().toISOString()
          });
        });

        if (validRecommendations.length > 0) {
          await batch.commit();
        }
      }

      return NextResponse.json({ success: true, data: { ...parsed, _source: usedModel } });
    } catch (apiError: unknown) {
      console.error("Gemini Match API failed:", apiError instanceof Error ? apiError.message : "unknown");
      throw apiError;
    }
  } catch (error: unknown) {
    console.error("Matching API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Matching failed", details: message }, { status: 500 });
  }
}
