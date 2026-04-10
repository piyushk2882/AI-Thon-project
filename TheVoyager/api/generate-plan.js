import { jsonrepair } from 'jsonrepair';

async function callAI(prompt) {
  for (let i = 0; i < 3; i++) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "liquid/lfm-2.5-1.2b-instruct:free",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    // If we have successful choices, return immediately
    if (data.choices) return data;

    // Log the actual error from OpenRouter for debugging
    console.error(`OpenRouter API Error (Attempt ${i + 1}):`, JSON.stringify(data, null, 2));
    
    // Wait before retrying (backoff)
    await new Promise(res => setTimeout(res, 1000));
  }

  throw new Error("AI API failed after retries. Check server console for OpenRouter error details.");
}

export default async function handler(req, res) {
  try {
    const { location, days, people, profile, budget, currentLocation } = req.body;

    const originLine = currentLocation ? `Origin (Departing From): ${currentLocation}` : '';
    const from = currentLocation || 'your city';

    const prompt = `
Generate 3 travel plans for a trip to ${location}.

Trip Details:
- Destination: ${location}
${originLine}
- Duration: ${days} days
- Travelers: ${people} people
- Traveler Type: ${profile}
- Budget Range: $${budget}

For EACH plan, recommend the most appropriate mode of transport from "${from}" to "${location}" that fits that plan's budget tier:
- Budget plan: cheapest viable option (e.g., overnight train, budget airline, bus)
- Standard plan: comfortable option (e.g., direct economy flight, express train)
- Premium plan: most comfortable/fastest option (e.g., business class flight, private jet, private transfer)

For EACH day in EACH plan, provide a rich, detailed breakdown including:
- A descriptive title for the day
- Morning activities (what to do, see, experience)
- Afternoon activities
- Evening activities / dinner
- Top 2-3 restaurants for that day with cuisine type and price range
- Top 3-4 places/attractions to visit with a one-line description
- A highlight tip for the day

Return ONLY valid JSON in this EXACT format. No markdown, no extra text, just raw JSON:
{
  "plans": [
    {
      "type": "budget",
      "transport": "Budget airline or overnight train from ${from} to ${location}",
      "cost_breakdown": {
        "travel": 300,
        "stay": 400,
        "food": 200,
        "activities": 100
      },
      "itinerary": [
        {
          "day": 1,
          "title": "Arrival & First Impressions",
          "morning": "Check in, explore the neighborhood, grab breakfast at a local cafe",
          "afternoon": "Visit the main city square, explore markets and street food",
          "evening": "Rooftop bar sunset views, dinner at a local bistro",
          "restaurants": [
            { "name": "Local Bistro", "cuisine": "Mediterranean", "price_range": "$" },
            { "name": "Street Food Market", "cuisine": "Local Street Food", "price_range": "$" }
          ],
          "places": [
            { "name": "City Central Park", "description": "Perfect for a morning stroll", "lat": 48.8566, "lng": 2.3522 },
            { "name": "Old Town Square", "description": "Historic heart of the city", "lat": 48.8584, "lng": 2.2945 },
            { "name": "Local Art Museum", "description": "Free entry on weekdays", "lat": 48.8606, "lng": 2.3376 }
          ],
          "tip": "Buy a day transit pass to save money on local transport"
        }
      ]
    },
    {
      "type": "standard",
      "transport": "Direct economy flight from ${from} to ${location}",
      "cost_breakdown": {
        "travel": 350,
        "stay": 600,
        "food": 300,
        "activities": 250
      },
      "itinerary": [
        {
          "day": 1,
          "title": "Arrival & City Discovery",
          "morning": "Hotel check-in, welcome breakfast, orientation walk",
          "afternoon": "Guided city highlights tour, iconic landmarks",
          "evening": "Fine dining experience, evening river cruise",
          "restaurants": [
            { "name": "The Grand Terrace", "cuisine": "Contemporary European", "price_range": "$$" },
            { "name": "Harbor View Restaurant", "cuisine": "Seafood", "price_range": "$$" }
          ],
          "places": [
            { "name": "Main Cathedral", "description": "Stunning Gothic architecture", "lat": 48.8530, "lng": 2.3499 },
            { "name": "Famous Museum", "description": "World-class art collection", "lat": 48.8606, "lng": 2.3376 },
            { "name": "Historic Bridge", "description": "Iconic city landmark with river views", "lat": 48.8545, "lng": 2.3514 }
          ],
          "tip": "Book your dinner reservation in advance, especially on weekends"
        }
      ]
    },
    {
      "type": "premium",
      "transport": "Business class flight from ${from} to ${location} with private airport transfer",
      "cost_breakdown": {
        "travel": 700,
        "stay": 1100,
        "food": 400,
        "activities": 300
      },
      "itinerary": [
        {
          "day": 1,
          "title": "Grand Arrival & Luxury Welcome",
          "morning": "Private airport transfer, luxury suite check-in, champagne breakfast",
          "afternoon": "Private guided city tour, exclusive access to landmarks",
          "evening": "Michelin-star dinner, exclusive rooftop experience",
          "restaurants": [
            { "name": "Le Prestige", "cuisine": "Michelin-star French", "price_range": "$$$$" },
            { "name": "Sky Lounge", "cuisine": "International Fine Dining", "price_range": "$$$" }
          ],
          "places": [
            { "name": "VIP Cultural Center", "description": "After-hours private access", "lat": 48.8630, "lng": 2.3370 },
            { "name": "Luxury Shopping District", "description": "World's finest boutiques", "lat": 48.8697, "lng": 2.3078 },
            { "name": "Private Garden", "description": "Exclusive members-only garden", "lat": 48.8620, "lng": 2.3200 }
          ],
          "tip": "Your concierge can arrange last-minute reservations at any venue"
        }
      ]
    }
  ]
}

IMPORTANT: Generate REAL, ACCURATE data for "${location}". Use actual restaurant names, real landmark names with correct coordinates for ${location}. Generate exactly ${days} days in each plan's itinerary array. Make each day unique and progressively explore different aspects of ${location}.
`;


    const data = await callAI(prompt);
    
    const text = data.choices[0].message.content;

    // Remove any potential markdown wrappers
    let cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    // Find the start of the JSON object
    const startIndex = cleaned.indexOf('{');
    if (startIndex !== -1) {
      cleaned = cleaned.substring(startIndex);
    }

    // Repair truncated JSON: count open/close braces and brackets to detect
    // when the AI stops outputting early (e.g., missing final '}' for root object).
    let braces = 0, brackets = 0, inString = false, escape = false;
    for (const ch of cleaned) {
      if (escape) { escape = false; continue; }
      if (ch === '\\' && inString) { escape = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === '{') braces++;
      if (ch === '}') braces--;
      if (ch === '[') brackets++;
      if (ch === ']') brackets--;
    }
    // Append missing closing tokens
    while (brackets > 0) { cleaned += ']'; brackets--; }
    while (braces > 0)   { cleaned += '}'; braces--; }

    let json;
    try {
      json = JSON.parse(cleaned);
    } catch (parseError) {
      console.warn("Strict JSON.parse failed, trying jsonrepair...");
      try {
        const repaired = jsonrepair(cleaned);
        json = JSON.parse(repaired);
        console.log("jsonrepair successfully fixed the JSON.");
      } catch (repairError) {
        console.warn("jsonrepair failed, attempting relaxed JS eval fallback...");
        try {
          json = (new Function("return " + cleaned))();
        } catch (relaxedParseError) {
          console.error("==== ALL PARSE STRATEGIES FAILED ====");
          console.error("Original parse error:", parseError.message);
          console.error("Repair error:", repairError.message);
          console.error("Raw AI Response:", text);
          console.error("=====================================");
          throw new Error("Completely invalid output from AI model");
        }
      }
    }

    res.status(200).json(json);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI failed to generate plan", details: error.message });
  }
}