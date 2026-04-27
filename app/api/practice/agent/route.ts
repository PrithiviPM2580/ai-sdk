import {
  ToolLoopAgent,
  tool,
  InferAgentUIMessage,
  UIMessage,
  createAgentUIStreamResponse,
} from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"
import { openRouter } from "@/lib/open-route"
import { selectModel } from "@/lib/helper"

export const weatherAgent = new ToolLoopAgent({
  model: openRouter.chat(selectModel("title", "quality")),

  instructions: `
    You are a helpful weather assistant.
    Always use the weather tool when needed.
  `,

  tools: {
    getWeather: tool({
      description: "Get weather for a city",
      inputSchema: z.object({
        city: z.string(),
      }),
      execute: async ({ city }) => {
        if (city === "Kathmandu") {
          return { city, temp: 20, condition: "Cloudy" }
        }
        if (city === "Pokhara") {
          return { city, temp: 25, condition: "Sunny" }
        }
        return { city, temp: 0, condition: "Unknown" }
      },
    }),
  },
})

/**
 * 🔥 THIS is the important part
 * It infers message + tool types automatically
 */
export type WeatherAgentMessage = InferAgentUIMessage<typeof weatherAgent>

export async function POST(request: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json()

    return createAgentUIStreamResponse({
      agent: weatherAgent,
      uiMessages: messages,
    })
  } catch (error) {
    console.error("Error processing request:", error)
    return new Response("Error processing request", { status: 500 })
  }
}
