/**
 * DisasterSense AI - Groq AI Service
 * Uses Groq API with Llama 3.3 70B for disaster detection, classification, and analysis.
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

/**
 * Analyze a social media post for disaster indicators.
 * Returns structured JSON with disaster type, severity, location, etc.
 */
export async function analyzePost(postText, metadata = {}) {
  const systemPrompt = `You are an expert disaster detection AI system. Analyze the following social media post and determine if it describes a real disaster event.

You must respond ONLY with valid JSON in this exact format:
{
  "is_disaster": boolean,
  "disaster_type": "Flood" | "Earthquake" | "Wildfire" | "Cyclone" | "Landslide" | "Tsunami" | "Tornado" | "Drought" | "Storm" | "None",
  "location": "City, Region/Country" or "Unknown",
  "severity": "Critical" | "High" | "Medium" | "Low" | "None",
  "urgency": "Immediate" | "High" | "Moderate" | "Low" | "None",
  "confidence": 0.0 to 1.0,
  "summary": "Brief factual summary of what the post describes",
  "recommended_action": "Specific actionable recommendation for response agencies",
  "affected_population": "Estimated affected people if mentioned",
  "keywords": ["relevant", "disaster", "keywords"]
}

Important guidelines:
- Only classify as disaster if there is genuine evidence of a real event
- Be skeptical of exaggerated or sensationalized language
- Extract precise location information when available
- Set confidence based on specificity and credibility indicators
- If not a disaster, set is_disaster to false and severity/urgency to "None"`;

  const userMessage = `Analyze this post:\n\n"${postText}"\n\nSource: ${metadata.source || 'Unknown'}\nTimestamp: ${metadata.timestamp || new Date().toISOString()}\nAuthor: ${metadata.author || 'Unknown'}`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.1,
        max_tokens: 1024,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) throw new Error('Empty response from Groq');
    
    const result = JSON.parse(content);
    return {
      ...result,
      model: MODEL,
      tokens_used: data.usage?.total_tokens || 0,
      analyzed_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Groq analysis error:', error);
    throw error;
  }
}

/**
 * Batch analyze multiple posts for efficiency.
 */
export async function batchAnalyzePosts(posts) {
  const results = [];
  for (const post of posts) {
    try {
      const result = await analyzePost(post.text, {
        source: post.source,
        timestamp: post.timestamp,
        author: post.author,
      });
      results.push({ postId: post.id, ...result });
      // Rate limiting: small delay between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (err) {
      results.push({ postId: post.id, error: err.message });
    }
  }
  return results;
}

/**
 * Generate a comprehensive alert summary from verified incident data.
 */
export async function generateAlertSummary(incidentData) {
  const systemPrompt = `You are a disaster response coordinator AI. Generate a clear, actionable emergency alert based on the verified incident data. Respond in JSON format:
{
  "alert_title": "Brief, clear title",
  "alert_body": "Detailed description with key facts",
  "affected_areas": ["list of affected areas"],
  "recommended_actions": ["list of specific actions"],
  "evacuation_needed": boolean,
  "resources_needed": ["list of resources"],
  "priority_level": "P1" | "P2" | "P3" | "P4"
}`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Incident data:\n${JSON.stringify(incidentData, null, 2)}` },
        ],
        temperature: 0.2,
        max_tokens: 1024,
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices?.[0]?.message?.content || '{}');
  } catch (error) {
    console.error('Alert generation error:', error);
    throw error;
  }
}

export default { analyzePost, batchAnalyzePosts, generateAlertSummary };
