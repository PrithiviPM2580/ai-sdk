import { selectModel } from "@/lib/helper"
import { openRouter } from "@/lib/open-route"
import { Output, stepCountIs, tool, ToolLoopAgent } from "ai"
import { z } from "zod"

export async function POST(request: Request) {
  try {
    const weatherAgent = new ToolLoopAgent({
      model: openRouter.chat(selectModel("chat", "balanced")),
      tools: {
        weather: tool({
          description: "Get the weather in a location (in Fahrenheit)",
          inputSchema: z.object({
            location: z
              .string()
              .describe("The location to get the weather for"),
          }),
          execute: async ({ location }) => ({
            location,
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
          }),
        }),
        convertFahrenheitToCelsius: tool({
          description: "Convert temperature from Fahrenheit to Celsius",
          inputSchema: z.object({
            temperature: z.number().describe("Temperature in Fahrenheit"),
          }),
          execute: async ({ temperature }) => {
            const celsius = Math.round((temperature - 32) * (5 / 9))
            return { celsius }
          },
        }),
      },
      stopWhen: stepCountIs(3),
      onFinish: ({ toolResults }) => {
        console.log("Agent finished with tool results:", toolResults)
      },
    })

    const result = await weatherAgent.generate({
      prompt: "What is the weather in San Francisco in celsius?",
    })

    console.log(result.text) // agent's final answer
    console.log(result.steps) // steps taken by the agen
  } catch (error) {
    console.error("Error processing request:", error)
    return new Response("Error processing request", { status: 500 })
  }
}

export async function GET() {
  try {
    const analysisAgent = new ToolLoopAgent({
      model: openRouter.chat(selectModel("chat", "balanced")),
      output: Output.object({
        schema: z.object({
          sentiment: z.enum(["positive", "neutral", "negative"]),
          summary: z.string(),
          keyPoints: z.array(z.string()),
        }),
      }),
      stopWhen: stepCountIs(2),
      onFinish: ({ toolResults }) => {
        console.log("Agent finished with tool results:", toolResults)
      },
    })

    const { output } = await analysisAgent.generate({
      prompt: "Analyze customer feedback from the last quarter",
    })

    console.log("Agent Output:", output)
    console.log("Sentiment:", output.sentiment)
    console.log("Summary:", output.summary)
    console.log("Key Points:", output.keyPoints)
  } catch (error) {
    console.error("Error processing request:", error)
    return new Response("Error processing request", { status: 500 })
  }
}
