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
      } else if (city === "Lalitpur") {
        return "75°F and rainy"
      } else if (city === "Bhaktapur") {
        return "65°F and windy"
      } else {
        return `Sorry, I don't have weather information for ${city}`
      }
    },
  }),
  changeDegreeToCelsius: tool({
    description: "Change degree from Fahrenheit to Celsius",
    inputSchema: z.object({
      fahrenheit: z
        .number()
        .describe("The temperature in Fahrenheit to convert to Celsius"),
    }),
    execute: async ({ fahrenheit }) => {
      const celsius = ((fahrenheit - 32) * 5) / 9
      return `${celsius}°C`
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
      onStepFinish: ({ toolResults }) => {
        console.log(toolResults)
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Error in POST /api/tools:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
