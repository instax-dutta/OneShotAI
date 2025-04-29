import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json();
    if (!idea || typeof idea !== "string") {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    // Prepare the prompt for Mistral API
    const systemPrompt = `You are an expert AI developer prompt engineer. Given a user idea, generate a single, highly effective oneshot prompt that will ensure the best results from AI developers. Be concise, clear, and maximize the likelihood of success.`;
    const userPrompt = `User wants to build: ${idea}\nGenerate the best oneshot prompt for this.`;

    // Call Mistral API (replace with your actual API key and endpoint)
    const mistralApiKey = process.env.MISTRAL_API_KEY;
    if (!mistralApiKey) {
      return NextResponse.json({ error: "Mistral API key not set." }, { status: 500 });
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
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Mistral API error: ${await response.text()}` }, { status: 500 });
    }

    const data = await response.json();
    const generatedPrompt = data.choices?.[0]?.message?.content?.trim() || "Failed to generate prompt.";

    return NextResponse.json({ prompt: generatedPrompt });
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}