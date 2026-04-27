import { google } from "@ai-sdk/google"
import {
  streamText,
  tool,
  InferUITools,
  UIMessage,
  UIDataTypes,
  convertToModelMessages,
  stepCountIs,
} from "ai"
import { z } from "zod"

const tools = {
  getLocation: tool({
    description: "Get the current location of the user",
    inputSchema: z.object({
      name: z
        .string()
        .describe("The name of the location to get the coordinates for"),
    }),
    execute: async ({ name }) => {
      if (name === "Kathmandu") {
        return "Kathmandu City"
      } else if (name === "Pokhara") {
        return "Pokhara City"
      } else {
        return "Location not found"
      }
    },
  }),
  getWeather: tool({
    description: "Get the current weather of a location",
    inputSchema: z.object({
      city: z
        .string()
        .describe("The name of the location to get the weather for"),
    }),
    execute: async ({ city }) => {
      if (city === "Kathmandu city") {
        return "The current weather in Kathmandu city is 25°C and sunny."
      } else if (city === "Pokhara city") {
        return "The current weather in Pokhara city is 22°C and cloudy."
      } else {
        return "Weather information not found for the specified location."
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
      stopWhen: stepCountIs(3),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Error in POST /api/multiple-tools:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
