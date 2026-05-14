# 🎤 DisasterSense AI - Hackathon Demo Script

This script is designed to help you deliver a flawless 3-5 minute presentation of DisasterSense AI.

## Setup Before Demo
1. Ensure the app is running (`npm run dev`).
2. Go to **Settings** and ensure **Demo Mode** is toggled ON so the dashboard is populated with beautiful map data.
3. Have a "fake" disaster post and a "real" disaster post ready to copy-paste.

---

## 1. The Hook (30 seconds)
**Speaker:** "Every minute counts during a natural disaster. But today, emergency responders are drowning in social media noise and fake news. It’s impossible to verify what’s real and what’s panic. That’s why we built **DisasterSense AI**—a real-time command center that uses LLMs to detect disasters and automatically cross-verifies them against scientific APIs to filter out misinformation."

*(Show the **Home Page** briefly, highlight the pipeline diagram)*

## 2. The Dashboard (1 minute)
**Speaker:** "Let's look at the Command Center."
*(Click to **Dashboard**)*

"Here, agencies get a bird's-eye view. We track how many alerts are verified versus how many are fake. In the center, our live trends chart shows incident spikes over the last 7 days. On the right, the interactive map plots verified emergencies based on severity—Critical alerts in red, High in orange."

*(Hover over a red marker on the map to show the popup)*
"You can instantly see the exact location, summary, and credibility score."

## 3. The Magic: Verification Center (1.5 minutes)
**Speaker:** "But how do we know this data is real? Let's go to the **Verification Center**."
*(Click to Verification Center)*

"Our system ingests data continuously, but let's do a manual test. I'm going to paste a panicked social media post."
*(Paste the following text into the AI Post Analyzer:)*
> *"BREAKING: Massive flooding in downtown Chennai right now! Water is waist-deep. Cars are floating away near the central station. We need help!"*

*(Click Analyze)*
"Watch what happens. We are hitting Groq using Llama 3.3. It instantly parses the unstructured text, extracts the location, and flags it as a Flood with Critical severity. 

But it doesn't stop there. Behind the scenes, our **Verification Engine** took those coordinates and queried the **Open-Meteo API** to check rainfall, and checked **ReliefWeb** for news reports. Because the weather data matched the post, it generated a high Credibility Score of 92%."

## 4. Fake News Filtering (1 minute)
**Speaker:** "Now, let's see how it handles fake news."
*(Paste a fake post:)*
> *"OMG there's a huge 9.0 Earthquake happening in New York right now! Buildings are falling down!"*

*(Click Analyze)*
"The AI understands the context, but our verification engine queries the **USGS Earthquake API**. USGS reports zero seismic activity in New York today. Therefore, the Credibility Score drops to 0%, and this is flagged as **Likely Fake**, preventing unnecessary panic and saving agency resources."

## 5. Conclusion (30 seconds)
**Speaker:** "DisasterSense AI bridges the gap between chaotic social media and actionable intelligence. By combining the natural language power of Llama 3.3 with hard data from NASA, USGS, and weather APIs, we can help emergency responders act faster, smarter, and with absolute confidence. Thank you."
