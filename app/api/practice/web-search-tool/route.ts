import { google } from "@ai-sdk/google"
import { webSearch } from "@/lib/tavily"
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
  webSearch: tool({
    description:
      "Search the web for up-to-date or real-time information. Use this for recent events, news, or anything that may have changed after your training data.",
    inputSchema: z.object({
      query: z.string().describe("The search query"),
    }),
    execute: async ({ query }) => {
      console.log("Executing web search with query:", query)
      const result = await webSearch(query)
      console.log("Web search result:", result)

      return JSON.stringify(result)
    },
  }),
}

export type ChatTools = InferUITools<typeof tools>
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>

export async function POST(request: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await request.json()
    console.log("Received messages:", messages)

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: await convertToModelMessages(messages),
      tools,
      system: `
      You are an AI assistant with access to a webSearch tool.
      
      IMPORTANT:
      - If the user asks about recent events, news, or anything time-sensitive, you MUST use the webSearch tool.
      - Do NOT answer from your own knowledge for "latest", "recent", or date-specific queries.
`,
      stopWhen: stepCountIs(2),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Error in POST /api/web-search-tool:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
