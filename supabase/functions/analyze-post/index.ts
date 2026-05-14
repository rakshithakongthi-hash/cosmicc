// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { analyzePost } from '../../src/services/groq.js' // Conceptual import
import { verifyIncident } from '../../src/services/verification.js' // Conceptual import

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  try {
    const { record } = await req.json()
    
    // This function is triggered when a new row is inserted into 'raw_posts'
    const postText = record.content
    
    // 1. Analyze with Groq
    const analysis = await analyzePost(postText, {
      source: record.source,
      timestamp: record.posted_at
    })
    
    // Update analyzed status
    await supabase.from('analyzed_posts').insert({
      raw_post_id: record.id,
      is_disaster: analysis.is_disaster,
      disaster_type: analysis.disaster_type,
      location: analysis.location,
      severity: analysis.severity,
      urgency: analysis.urgency,
      confidence: analysis.confidence,
      summary: analysis.summary,
      recommended_action: analysis.recommended_action
    })

    if (!analysis.is_disaster) {
      return new Response(JSON.stringify({ status: 'Ignored, not a disaster' }), { headers: { "Content-Type": "application/json" } })
    }

    // 2. Verify Incident
    const verification = await verifyIncident(analysis)
    
    // 3. Check Alert Rules
    if (analysis.confidence >= 0.75 && verification.credibility_score >= 0.80 && ['High', 'Critical'].includes(analysis.severity)) {
      
      // 4. Generate Alert
      const { data: alert } = await supabase.from('alerts').insert({
        disaster_type: analysis.disaster_type,
        location: analysis.location,
        latitude: verification.coordinates?.latitude,
        longitude: verification.coordinates?.longitude,
        severity: analysis.severity,
        urgency: analysis.urgency,
        confidence: analysis.confidence,
        credibility_score: verification.credibility_score,
        fake_probability: verification.fake_probability,
        verification_status: verification.verification_status,
        summary: analysis.summary,
        recommended_action: analysis.recommended_action,
        weather_verified: verification.weather_verified,
        official_source_verified: verification.official_source_verified,
        multi_source_verified: verification.multi_source_verified,
        verification_notes: verification.verification_notes
      }).select().single()
      
      return new Response(JSON.stringify({ status: 'Alert Generated', alert }), { headers: { "Content-Type": "application/json" } })
    }

    return new Response(JSON.stringify({ status: 'Analyzed, no alert threshold met' }), { headers: { "Content-Type": "application/json" } })
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 })
  }
})
