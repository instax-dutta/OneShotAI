import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json();
    if (!idea || typeof idea !== "string") {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    // Prepare the prompt for OneShotML
    const systemPrompt = `You are an elite prompt engineer. Produce ONE production-ready, copy-pastable prompt tailored to the user's idea. Rules:\n- Output ONLY the prompt content, no preface, titles, or markdown fences\n- Make it concise, specific, and actionable\n- Include role, objective, constraints, style, and clear steps\n- Clarify assumptions where helpful, but avoid meta commentary\n- Prefer bullet lists for steps or acceptance criteria if useful`;
    const userPrompt = `User idea: ${idea}\nCraft the single best prompt following the rules.`;

    // Call OneShotML API (replace with your actual API key and endpoint)
    const mistralApiKey = process.env.MISTRAL_API_KEY;
    if (!mistralApiKey) {
      return NextResponse.json({ error: "API key not set." }, { status: 500 });
    }

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mistralApiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-medium",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        // Raise token cap to reduce truncation risk on longer prompts
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Upstream API error: ${await response.text()}` }, { status: 500 });
    }

    const data = await response.json();
    const generatedPrompt = data.choices?.[0]?.message?.content?.trim() || "Failed to generate prompt.";

    return NextResponse.json({ prompt: generatedPrompt });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}