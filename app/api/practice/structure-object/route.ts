import { streamText, Output } from "ai"
import { google } from "@ai-sdk/google"
import { recipeSchema } from "@/validators"

export async function POST(request: Request) {
  try {
    const { dish } = await request.json()

    const result = streamText({
      model: google("gemini-2.5-flash"),
      output: Output.object({ schema: recipeSchema }),
      prompt: `Generate a recipe for the dish ${dish}`,
    })

    result.usage.then((usage) => {
      console.log("Input tokens:", usage.inputTokens)
      console.log("Output tokens:", usage.outputTokens)
      console.log("Token usage:", usage.totalTokens)
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error in POST /api/structure-object:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    })
  }
}
