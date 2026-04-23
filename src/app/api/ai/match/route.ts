import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function getMatchFallback(incident: Record<string, string>) {
  const priority = incident?.priority || "HIGH";
  const location = incident?.location || "Central Zone";

  return {
    recommended_volunteers: [
      {
        name: "Priya Singh",
        match_score: 96,
        reasoning: `Closest volunteer to ${location} with medical and counseling certifications. Previously handled ${priority} priority incidents with 100% success rate.`,
        estimated_arrival: "5 min",
        assigned_role: "Team Lead & Medical Support"
      },
      {
        name: "Anita Sharma",
        match_score: 91,
        reasoning: `First-aid certified with water purification training. Has completed 47 missions this month with excellent coordination skills.`,
        estimated_arrival: "8 min",
        assigned_role: "Resource Distribution Coordinator"
      },
      {
        name: "Raj Patel",
        match_score: 85,
        reasoning: "Logistics specialist with driving license and cargo vehicle access. Ideal for bulk resource transportation.",
        estimated_arrival: "15 min",
        assigned_role: "Logistics & Transport"
      },
      {
        name: "Kavya Nair",
        match_score: 78,
        reasoning: "Food distribution experience with first-aid basics. Can support the primary team with crowd management.",
        estimated_arrival: "20 min",
        assigned_role: "Crowd Management & Food Aid"
      }
    ],
    team_composition_notes: `Team of 4 optimized for ${priority} priority incident at ${location}. Lead volunteer (Priya) has relevant domain expertise. Logistics covered by Raj with vehicle access. Coverage for medical, distribution, and crowd management.`,
    coverage_gaps: [
      "No structural engineer available",
      "Heavy machinery operator not in pool",
    ],
    dispatch_priority_order: ["Priya Singh", "Anita Sharma", "Raj Patel", "Kavya Nair"],
    _source: "fallback (API quota exceeded — mock response for demo)"
  };
}

export async function POST(req: Request) {
  try {
    const { incident, volunteers } = await req.json();

    if (!incident) {
      return NextResponse.json({ error: "Missing 'incident' data" }, { status: 400 });
    }

    // Try real Gemini API
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const volunteerList = volunteers || [
        { name: "Anita Sharma", skills: ["first-aid", "water-purification"], distance_km: 1.2, available: true },
        { name: "Raj Patel", skills: ["logistics", "driving"], distance_km: 3.5, available: true },
        { name: "Priya Singh", skills: ["medical", "counseling"], distance_km: 0.8, available: true },
        { name: "Arjun Mehta", skills: ["construction", "electrical"], distance_km: 2.1, available: false },
        { name: "Kavya Nair", skills: ["first-aid", "food-distribution"], distance_km: 4.0, available: true },
      ];

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

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);

      return NextResponse.json({ success: true, data: { ...parsed, _source: "gemini-2.0-flash" } });
    } catch (apiError: unknown) {
      console.warn("Gemini Match API unavailable, using fallback:", apiError instanceof Error ? apiError.message : "unknown");
    }

    // Fallback
    const fallback = getMatchFallback(incident);
    return NextResponse.json({ success: true, data: fallback });
  } catch (error: unknown) {
    console.error("Matching API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Matching failed", details: message }, { status: 500 });
  }
}
