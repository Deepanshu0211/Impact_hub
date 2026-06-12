import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// CRITICAL FIX #4: Use service role key for admin operations (fallback to anon for hackathon)
const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(req: Request) {
  try {
    const { text, reporter_name, reporter_mobile } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing 'text' field" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const reporterName = typeof reporter_name === "string" && reporter_name.trim() ? reporter_name.trim() : user?.user_metadata?.full_name || user?.email || "Anonymous";
    const reporterMobile = typeof reporter_mobile === "string" ? reporter_mobile.trim() : "";

    // === SERVER-SIDE PHONE VALIDATION ===
    const phoneDigits = reporterMobile.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      return NextResponse.json({
        error: "Invalid phone number",
        details: "Phone number must contain at least 10 digits. Please provide a valid, reachable contact number."
      }, { status: 400 });
    }

    try {
      let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      let usedModel = "gemini-2.5-flash";

      const prompt = `You are an emergency response NLP engine for "Impact Hub" — a humanitarian disaster relief and community impact platform. Your job is to:
1. Check if this report is a GENUINE emergency related to our concept (disasters, humanitarian crises, community safety, medical emergencies, infrastructure damage, evacuations, resource shortages like food/water/shelter).
2. Validate the reporter's phone number.
3. Extract structured data from the report.

Field Report: "${text}"
Reporter Phone: "${reporterMobile}"

IMPORTANT RULES:
- If the report is about something UNRELATED to disaster relief, humanitarian aid, or community emergencies (e.g., ordering food delivery, tech support, jokes, random text, advertising, personal complaints unrelated to emergencies), set "is_relevant" to false.
- If the phone number looks fake, has repeating digits like 0000000000 or 1234567890, or is clearly not a real number, set "phone_valid" to false.

Return ONLY valid JSON (no markdown, no code fences) with these fields:
{
  "is_relevant": true or false (is this report about a real disaster/humanitarian/community emergency?),
  "rejection_reason": "if is_relevant is false, explain why in one sentence. If relevant, set to null",
  "phone_valid": true or false (does the phone number look like a real, reachable number?),
  "phone_issue": "if phone_valid is false, explain why in one sentence. If valid, set to null",
  "location": "extracted location or 'Unknown'",
  "resource_needed": "what resource/help is needed",
  "priority": "CRITICAL or HIGH or NORMAL based on urgency",
  "affected_count": "number of people affected or 'Unknown'",
  "category": "one of: Water, Medical, Food, Shelter, Evacuation, Infrastructure, Other",
  "summary": "one-line summary of the situation",
  "recommended_action": "what action should be taken immediately",
  "volunteers_needed": "a number representing how many volunteers are needed based on severity (e.g., 5, 10, 50)",
  "confidence_score": a number 0-100 representing extraction confidence
}`;

      let result;
      try {
        result = await model.generateContent(prompt);
      } catch (e: any) {
        if (e.message?.includes("503") || e.status === 503) {
          model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
          usedModel = "gemini-2.5-flash-lite";
          result = await model.generateContent(prompt);
        } else { throw e; }
      }

      const responseText = result.response.text();
      const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);

      // === RELEVANCE CHECK ===
      // Reject reports that are NOT related to Impact Hub's disaster/humanitarian concept
      if (parsed.is_relevant === false) {
        return NextResponse.json({
          error: "Report not relevant",
          details: parsed.rejection_reason || "This does not appear to be a disaster, humanitarian, or community emergency report. Impact Hub only processes genuine emergency and relief requests."
        }, { status: 400 });
      }

      // === PHONE VALIDATION (AI-assisted) ===
      if (parsed.phone_valid === false) {
        return NextResponse.json({
          error: "Invalid phone number",
          details: parsed.phone_issue || "The phone number provided does not appear to be a valid, reachable number. Please enter a real contact number so responders can follow up."
        }, { status: 400 });
      }

      // === LOCATION VALIDATION ===
      const loc = (parsed.location || "").trim().toLowerCase();
      if (!loc || loc === "unknown" || loc === "not mentioned" || loc === "n/a" || loc === "unspecified") {
        return NextResponse.json({
          error: "Location is required",
          details: "Your field report must mention a specific place/area/city. AI could not extract any location. Please include a location and try again."
        }, { status: 400 });
      }

      // Get reporter name for display
      let ngoName = reporterName;
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('metadata').eq('id', user.id).single();
        ngoName = profile?.metadata?.full_name || profile?.metadata?.orgName || user.user_metadata?.full_name || reporterName;
      }

      // === AI CONFIDENCE VERIFICATION ===
      // If confidence_score > 85% => direct dispatch (Active)
      // Else => forward to review team (Pending Review) for NGO/Admin verification
      const confidenceScore = typeof parsed.confidence_score === "number" ? parsed.confidence_score : 0;
      const isHighConfidence = confidenceScore > 85;
      const incidentStatus = isHighConfidence ? "Active" : "Pending Review";

      // Save to Supabase Incidents
      const { data: incident, error: insertError } = await adminSupabase
        .from('incidents')
        .insert({
          location: parsed.location || "Unknown Location",
          type: parsed.category || "General",
          priority: parsed.priority || "NORMAL",
          status: incidentStatus,
          affected: parsed.affected_count || "Unknown",
          description: [
            parsed.summary || "",
            `Emergency user: ${reporterName}`,
            reporterMobile ? `Phone: ${reporterMobile}` : "",
            `AI Confidence: ${confidenceScore}%${!isHighConfidence ? " — PENDING HUMAN VERIFICATION" : ""}`,
            `Posted at: ${new Date().toISOString()}`
          ].filter(Boolean).join(" | "),
          volunteers_needed: parseInt(parsed.volunteers_needed) || 0,
          created_by: user?.id || null
        })
        .select()
        .single();

      const emergencySubmissionPayload = {
        source: "text",
        input_text: text,
        reporter_name: reporterName,
        reporter_mobile: reporterMobile,
        submitted_at: new Date().toISOString(),
        parsed,
        incident_id: incident?.id || null,
        created_by: user?.id || null,
      };

      const { error: submissionError } = await adminSupabase
        .from('emergency_submissions')
        .insert({
          incident_id: incident?.id || null,
          submitted_by_user_id: user?.id || null,
          reporter_name: reporterName,
          reporter_mobile: reporterMobile,
          report_mode: "text",
          location: parsed.location || "Unknown Location",
          details: [
            parsed.summary || "",
            `Emergency user: ${reporterName}`,
            reporterMobile ? `Phone: ${reporterMobile}` : "",
            `Posted at: ${new Date().toISOString()}`,
          ].filter(Boolean).join(" | "),
          priority: parsed.priority || "NORMAL",
          category: parsed.category || "General",
          status: incidentStatus,
          posted_at: new Date().toISOString(),
          payload: { ...emergencySubmissionPayload, confidence_score: confidenceScore, is_verified: isHighConfidence },
        });

      if (insertError) {
        console.error("Error inserting incident:", insertError);
      }

      if (submissionError) {
        console.error("Error inserting emergency submission:", submissionError);
      }

      // Save NLP extraction
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        await adminSupabase.from('nlp_extractions').insert({
          user_id: user.id,
          role_tag: profile?.role || null,
          raw_text: text,
          extracted_data: parsed
        });
      }

      // === CONFIDENCE-BASED ROUTING ===
      if (incident && isHighConfidence) {
        // HIGH CONFIDENCE (>85%): Direct dispatch — broadcast to ALL responders
        try {
          const { data: responderProfiles } = await adminSupabase
            .from('profiles')
            .select('id, role')
            .in('role', ['volunteer', 'ngo']);

          const emergencyNotifications = (responderProfiles || []).map((profile: any) => ({
            user_id: profile.id,
            type: "alert" as const,
            title: `🚨 EMERGENCY: ${parsed.category || "General"} in ${parsed.location}`,
            body: `${ngoName} reported a ${parsed.priority || "HIGH"} emergency. ${parsed.summary || parsed.recommended_action || "Immediate response required."}${reporterMobile ? ` Contact: ${reporterMobile}` : ""} [AI Confidence: ${confidenceScore}% — Auto-verified]`,
            read: false
          }));

          if (emergencyNotifications.length > 0) {
            await adminSupabase.from('notifications').insert(emergencyNotifications);
          }
        } catch (broadcastErr) {
          console.error("Emergency broadcast failed (non-critical):", broadcastErr);
        }
      } else if (incident && !isHighConfidence) {
        // LOW CONFIDENCE (≤85%): Forward to review team — only notify NGOs + Admins
        try {
          const { data: reviewerProfiles } = await adminSupabase
            .from('profiles')
            .select('id, role, metadata')
            .or('role.eq.ngo,metadata->>is_admin.eq.true');

          const reviewNotifications = (reviewerProfiles || []).map((profile: any) => ({
            user_id: profile.id,
            type: "alert" as const,
            title: `⚠️ REVIEW NEEDED: ${parsed.category || "General"} in ${parsed.location}`,
            body: `${ngoName} reported an emergency with LOW AI confidence (${confidenceScore}%). This report needs human verification before dispatch. ${parsed.summary || "Please review and verify."}${reporterMobile ? ` Contact: ${reporterMobile}` : ""}`,
            read: false
          }));

          if (reviewNotifications.length > 0) {
            await adminSupabase.from('notifications').insert(reviewNotifications);
          }
        } catch (broadcastErr) {
          console.error("Review notification failed (non-critical):", broadcastErr);
        }
      }

      // === AUTO-MATCH: Only run for high-confidence verified emergencies ===
      if (incident && isHighConfidence) {
        try {
          const { data: volunteers } = await adminSupabase
            .from('profiles')
            .select('*')
            .eq('role', 'volunteer');

          if (volunteers && volunteers.length > 0) {
            const volList = volunteers.map((v: any) => ({
              id: v.id,
              name: v.name || "Volunteer",
              skills: Array.isArray(v.metadata?.skills) ? v.metadata.skills : (v.metadata?.skills || "").split(",").map((s: string) => s.trim()).filter(Boolean),
              location: v.metadata?.location || "India"
            }));

            // HIGH FIX #9: Build a set of valid IDs to validate AI output
            const validVolunteerIds = new Set(volList.map((v: any) => v.id));

            let matchModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
            const matchPrompt = `You are a volunteer matching AI. Given this incident and volunteers, identify the best matches.

Incident: { "location": "${parsed.location}", "type": "${parsed.category}", "priority": "${parsed.priority}", "affected": "${parsed.affected_count}", "description": "${parsed.summary}" }

Volunteers: ${JSON.stringify(volList)}

Return ONLY valid JSON (no markdown, no code fences):
{
  "matches": [
    { "id": "volunteer UUID", "name": "name", "score": 0-100, "reason": "short reason why they match" }
  ]
}
Only include volunteers with score >= 50. Use the EXACT id values provided.`;

            const matchResult = await matchModel.generateContent(matchPrompt);
            const matchCleaned = matchResult.response.text().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            const matchParsed = JSON.parse(matchCleaned);

            if (matchParsed.matches && Array.isArray(matchParsed.matches)) {
              const notifications = matchParsed.matches
                .filter((m: any) => m.id && m.score >= 50 && validVolunteerIds.has(m.id))
                .map((m: any) => ({
                  user_id: m.id,
                  type: "ai" as const,
                  title: `🧠 AI Match: ${parsed.category} in ${parsed.location}`,
                  body: `${ngoName} reported a ${parsed.priority} incident. AI matched you (score: ${m.score}/100). ${m.reason}. Tap to review and accept.${reporterMobile ? ` Contact: ${reporterMobile}` : ""}`,
                  read: false
                }));

              if (notifications.length > 0) {
                await adminSupabase.from('notifications').insert(notifications);
              }
            }
          }
        } catch (matchErr) {
          console.error("Auto-match failed (non-critical):", matchErr);
        }
      }

      return NextResponse.json({ 
        success: true, 
        data: { 
          ...parsed, 
          incident_id: incident?.id, 
          _source: usedModel,
          ai_verified: isHighConfidence,
          confidence_score: confidenceScore,
          verification_status: isHighConfidence ? "auto_verified" : "pending_review"
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
