import { streamText } from "ai"
// import { google } from "@ai-sdk/google"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()
    const result = streamText({
      model: "google/gemini-2.0-flash",
      prompt,
    })
    result.usage.then((usage) => {
      console.log({
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      })
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Error generating completion:", error)
    return new Response(
      JSON.stringify({ error: "Failed to generate completion." }),
      { status: 500 }
    )
  }
}
