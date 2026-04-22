import { google } from "@ai-sdk/google"
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  UIDataTypes,
  tool,
  UIMessage,
  InferUITools,
} from "ai"
import { z } from "zod"

const tools = {
  getWeather: tool({
    description: "Get the weather for a location",
    inputSchema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
    execute: async ({ city }) => {
      if (city === "Kathmandu") {
        return "70°F and cloudy"
      } else if (city === "Pokhara") {
        return "80°F and sunny"
      } else {
        return "Unknown"
      }
    },
  }),
}

export type ChatTools = InferUITools<typeof tools>
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>

export async function POST(request: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await request.json()

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(2),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Error in POST /api/tools:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
