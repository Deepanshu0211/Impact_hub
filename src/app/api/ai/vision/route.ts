import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");



export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const description = formData.get("description") as string | null;

    if (!file && !description) {
      return NextResponse.json({ error: "Provide an image or description" }, { status: 400 });
    }

    // Try real Gemini API
    try {
      let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      let usedModel = "gemini-2.5-flash";
      let parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

      if (file) {
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        parts = [
          { inlineData: { mimeType: file.type, data: base64 } },
          { text: `You are a disaster damage assessment AI. Analyze this image and provide a damage assessment.

Return ONLY valid JSON (no markdown, no code fences) with these fields:
{
  "severity": "CRITICAL or HIGH or MEDIUM or LOW",
  "confidence": a number 0-100,
  "damage_type": "type of damage observed",
  "description": "detailed description of what you see",
  "hazards_identified": ["list", "of", "hazards"],
  "immediate_actions": ["list", "of", "recommended", "actions"],
  "estimated_affected_area": "estimated area description",
  "infrastructure_status": "intact, partial damage, or destroyed"
}` },
        ];
      } else {
        parts = [{ text: `You are a disaster damage assessment AI. Based on this description, provide a damage assessment.

Description: "${description}"

Return ONLY valid JSON (no markdown, no code fences) with these fields:
{
  "severity": "CRITICAL or HIGH or MEDIUM or LOW",
  "confidence": a number 0-100,
  "damage_type": "type of damage inferred",
  "description": "analysis of the situation",
  "hazards_identified": ["list", "of", "hazards"],
  "immediate_actions": ["list", "of", "recommended", "actions"],
  "estimated_affected_area": "estimated area description",
  "infrastructure_status": "intact, partial damage, or destroyed"
}` }];
      }

      let result;
      try {
        result = await model.generateContent(parts);
      } catch (e: any) {
        if (e.message?.includes("503") || e.status === 503) {
          console.warn("503 on gemini-2.5-flash, falling back to gemini-2.5-flash-lite...");
          model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
          usedModel = "gemini-2.5-flash-lite";
          result = await model.generateContent(parts);
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
          location: "Vision Assessment Location", // Fallback location
          type: parsed.damage_type || "Vision Assessment",
          priority: parsed.severity || "HIGH",
          status: "Active",
          description: parsed.description || "",
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
      console.error("Gemini Vision API failed:", apiError instanceof Error ? apiError.message : "unknown");
      throw apiError;
    }
  } catch (error: unknown) {
    console.error("Vision API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Vision analysis failed", details: message }, { status: 500 });
  }
}
