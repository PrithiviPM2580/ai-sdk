import { UIMessage, convertToModelMessages, streamText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(request: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json()

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: await convertToModelMessages(messages),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Error in POST /api/chat:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    })
  }
}
