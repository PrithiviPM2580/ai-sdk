import { streamText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(request: Request) {
  const { prompt } = await request.json()

  try {
    const result = await streamText({
      model: google("gemini-2.0-flash"),
      prompt,
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
