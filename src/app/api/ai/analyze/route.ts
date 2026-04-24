import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");



export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing 'text' field" }, { status: 400 });
    }

    // Try real Gemini API first
    try {
      let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      let usedModel = "gemini-2.5-flash";

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

      // Save to Supabase
      const { data: incident, error: insertError } = await supabase
        .from('incidents')
        .insert({
          location: parsed.location || "Unknown Location",
          type: parsed.category || "General",
          priority: parsed.priority || "NORMAL",
          status: "Active",
          affected: parsed.affected_count || "Unknown",
          description: parsed.summary || "",
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting incident into Supabase:", insertError);
      }

      return NextResponse.json({ 
        success: true, 
        data: { 
          ...parsed, 
          incident_id: incident?.id,
          _source: usedModel 
        } 
      });
    } catch (apiError: unknown) {
      console.error("Gemini API failed:", apiError instanceof Error ? apiError.message : "unknown");
      throw apiError;
    }
  } catch (error: unknown) {
    console.error("NLP API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "AI processing failed", details: message }, { status: 500 });
  }
}
