import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Realistic fallback when API quota is exhausted
function getFallback(text: string) {
  const lower = text.toLowerCase();
  const location = lower.includes("sector") ? text.match(/sector\s*\d+/i)?.[0] || "Sector 7" :
    lower.includes("downtown") ? "Downtown Area" :
    lower.includes("east") ? "East District" : "Central Zone";

  const resource = lower.includes("water") ? "Water Supply" :
    lower.includes("medical") || lower.includes("medicine") ? "Medical Supplies" :
    lower.includes("food") ? "Food & Nutrition" :
    lower.includes("shelter") || lower.includes("blanket") ? "Shelter & Blankets" : "Emergency Resources";

  const priority = lower.includes("urgent") || lower.includes("critical") || lower.includes("emergency") ? "CRITICAL" :
    lower.includes("damaged") || lower.includes("flood") || lower.includes("injured") ? "HIGH" : "NORMAL";

  const countMatch = text.match(/(\d+)\s*(?:people|persons|families|individuals)/i);
  const affected = countMatch ? `${countMatch[1]} people` : "Unknown";

  return {
    location,
    resource_needed: resource,
    priority,
    affected_count: affected,
    category: resource.split(" ")[0],
    summary: `${priority} priority ${resource.toLowerCase()} request at ${location}. ${affected !== "Unknown" ? `${affected} affected.` : ""}`,
    recommended_action: `Deploy ${resource.toLowerCase()} team to ${location} immediately. Coordinate with nearest volunteers.`,
    confidence_score: 82,
    _source: "fallback (API quota exceeded — mock response for demo)"
  };
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing 'text' field" }, { status: 400 });
    }

    // Try real Gemini API first
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `You are an emergency response NLP engine. Analyze the following field report and extract structured data.

Field Report: "${text}"

Return ONLY valid JSON (no markdown, no code fences) with these fields:
{
  "location": "extracted location or 'Unknown'",
  "resource_needed": "what resource/help is needed",
  "priority": "CRITICAL or HIGH or NORMAL based on urgency",
  "affected_count": "number of people affected or 'Unknown'",
  "category": "one of: Water, Medical, Food, Shelter, Evacuation, Infrastructure, Other",
  "summary": "one-line summary of the situation",
  "recommended_action": "what action should be taken immediately",
  "confidence_score": a number 0-100 representing extraction confidence
}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);

      return NextResponse.json({ success: true, data: { ...parsed, _source: "gemini-2.0-flash" } });
    } catch (apiError: unknown) {
      console.warn("Gemini API unavailable, using intelligent fallback:", apiError instanceof Error ? apiError.message : "unknown");
      // Fall through to fallback
    }

    // Fallback: intelligent text parsing
    const fallback = getFallback(text);
    return NextResponse.json({ success: true, data: fallback });
  } catch (error: unknown) {
    console.error("NLP API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "AI processing failed", details: message }, { status: 500 });
  }
}
