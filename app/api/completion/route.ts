import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST() {
  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: "What is the capital of France?",
    })

    return Response.json({ text })
  } catch (error) {
    console.error("Error generating text:", error)
    return Response.json({ error: "Failed to generate text" }, { status: 500 })
  }
}
