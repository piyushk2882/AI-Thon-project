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

    if (data.choices) return data;

    console.log(`Retrying... Attempt ${i + 1}`);
    await new Promise(res => setTimeout(res, 1000));
  }

  throw new Error("AI failed after retries");
}

export default async function handler(req, res) {
  try {
    const { location, days, people, profile, budget } = req.body;

    const prompt = `
Generate 3 travel plans for:

Location: ${location}
Days: ${days}
People: ${people}
Traveler Type: ${profile}
Budget: ${budget}

Provide:
- Budget Plan
- Standard Plan
- Premium Plan

Return ONLY JSON in this format:
{
  "plans": [
    {
      "type": "budget",
      "total_cost": number,
      "itinerary": ["Day 1: ..."],
      "cost_breakdown": {
        "travel": number,
        "stay": number,
        "food": number,
        "activities": number
      },
      "transport": "..."
    }
  ]
}
`;

    const data = await callAI(prompt);
    
    const text = data.choices[0].message.content;

    const cleaned = text.replace(/```json|```/g, "").trim();
    const json = JSON.parse(cleaned);

    res.status(200).json(json);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI failed" });
  }
}