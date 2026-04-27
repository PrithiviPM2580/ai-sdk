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
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`
      )
      const data = await response.json()
      const watherData = {
        location: {
          name: data.location.name,
          country: data.location.country,
          localtime: data.location.localtime,
        },
        current: {
          temp_c: data.current.temp_c,
          condition: {
            text: data.current.condition.text,
            code: data.current.condition.code,
          },
        },
      }
      return watherData
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
