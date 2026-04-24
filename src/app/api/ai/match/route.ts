import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");



export async function POST(req: Request) {
  try {
    const { incident } = await req.json();

    if (!incident) {
      return NextResponse.json({ error: "Missing 'incident' data" }, { status: 400 });
    }

    // Try real Gemini API
    try {
      let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      let usedModel = "gemini-2.5-flash";

      // Fetch volunteers from Supabase
      const { data: dbVolunteers, error: dbError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'volunteer');

      if (dbError) {
        console.warn("Could not fetch volunteers from Supabase. Ensure schema is set up.", dbError);
      }

      // Map the database profiles to the format Gemini expects
      const volunteerList = (dbVolunteers || []).map((v: any) => ({
        name: v.name || "Unknown Volunteer",
        skills: v.metadata?.skills || [],
        distance_km: v.metadata?.distance_km || 5.0,
        available: v.metadata?.available !== false
      })).filter((v: any) => v.available);

      // If no volunteers found, we can still pass an empty array or fallback
      if (volunteerList.length === 0) {
        volunteerList.push(
          { name: "System Fallback 1", skills: ["general-support"], distance_km: 1.0, available: true }
        );
      }

      const prompt = `You are a volunteer matching AI for disaster response. Match the best volunteers to this incident.

Incident: ${JSON.stringify(incident)}

Available Volunteers: ${JSON.stringify(volunteerList)}

Return ONLY valid JSON (no markdown, no code fences) with these fields:
{
  "recommended_volunteers": [
    {
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
          console.warn("503 on gemini-2.5-flash, falling back to gemini-2.5-flash-lite...");
          model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
          usedModel = "gemini-2.5-flash-lite";
          result = await model.generateContent(prompt);
        } else {
          throw e;
        }
      }

      const responseText = result.response.text();
      const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);

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
