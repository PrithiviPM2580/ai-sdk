import { groq } from "@ai-sdk/groq"
import {
  convertToModelMessages,
  generateText,
  ModelMessage,
  Output,
  streamText,
  UIMessage,
} from "ai"
import { z } from "zod"

const analyzeAgentSchema = z.object({
  joke: z.string().describe("The joke to analyze"),
  analysis: z.object({
    setup_quality: z
      .number()
      .min(1)
      .max(10)
      .describe("Rating of the joke's setup quality from 1 to 10"),
    punchline_strength: z
      .number()
      .min(1)
      .max(10)
      .describe("Rating of the joke's punchline strength from 1 to 10"),
    originality: z
      .number()
      .min(1)
      .max(10)
      .describe("Rating of the joke's originality from 1 to 10"),
    clarity: z
      .number()
      .min(1)
      .max(10)
      .describe("Rating of the joke's clarity from 1 to 10"),
    explanation: z
      .string()
      .describe("A brief explanation of the joke and its humor"),
    weakness: z
      .array(z.string())
      .describe(
        "A list of any weaknesses or areas for improvement in the joke"
      ),
    strength: z.array(z.string()).describe("A list of the joke's strengths"),
  }),
})

const improverAgentSchema = z.object({
  original_joke: z.string().describe("The original joke to improve"),
  improved_joke: z.string().describe("The improved version of the joke"),
  improvements_made: z
    .array(z.string())
    .describe("A list of specific improvements made to the joke"),
})

const judgeAgentSchema = z.object({
  original_joke: z.string().describe("The original joke"),
  improved_joke: z.string().describe("The improved joke"),
  scores: z.object({
    original: z.object({
      humor: z
        .number()
        .min(1)
        .max(10)
        .describe("Overall humor rating from 1 to 10"),
      originality: z
        .number()
        .min(1)
        .max(10)
        .describe("Originality rating from 1 to 10"),
    }),
    improved: z.object({
      humor: z
        .number()
        .min(1)
        .max(10)
        .describe("Overall humor rating from 1 to 10"),
      originality: z
        .number()
        .min(1)
        .max(10)
        .describe("Originality rating from 1 to 10"),
    }),
  }),
  winner: z
    .enum(["original", "improved", "tie"])
    .describe("Which joke is better or if it's a tie"),
  final_explanation: z
    .string()
    .describe("A brief explanation of the judgment and reasoning behind it"),
})

export async function POST(request: Request) {
  try {
    async function generateJoke(joke: string) {
      const model = groq("openai/gpt-oss-120b")

      //Input Handler
      const { text: jokeText } = await generateText({
        model,
        prompt: `Generate a joke based on the following input: ${joke}`,
      })

      //Analyze Agent
      const { text: analysisText } = await generateText({
        model,
        output: Output.object({
          schema: analyzeAgentSchema,
        }),
        prompt: `Analyze the following joke and provide ratings and explanations: ${jokeText}`,
      })

      //Improver Agent
      const { text: improvedJokeText } = await generateText({
        model,
        output: Output.object({
          schema: improverAgentSchema,
        }),
        prompt: `Improve the following joke based on its analysis. Provide the improved joke and a list of specific improvements made: ${jokeText}\n\nAnalysis:\n${analysisText}`,
      })

      //Judge Agent
      const judge = await generateText({
        model,
        output: Output.object({
          schema: judgeAgentSchema,
        }),
        prompt: `Judge the original joke and the improved joke. Provide scores for humor and originality, declare a winner, and explain the reasoning behind the judgment.\n\nOriginal Joke:\n${jokeText}\n\nImproved Joke:\n${improvedJokeText}`,
      })

      const { text: finalVerdict } = await generateText({
        model,
        prompt: `Based on the judge's analysis, provide a final verdict on the joke and any additional comments.\n\nJudge's Analysis:\n${judge.text}`,
      })

      return {
        joke: jokeText,
        analysis: analysisText,
        improvedJoke: improvedJokeText,
        judgment: judge.text,
        finalVerdict,
      }
    }

    const { joke }: { joke: string } = await request.json()
    const result = await generateJoke(joke)

    console.log("Generated Joke:", result.joke)
    console.log("Analysis:", result.analysis)
    console.log("Improved Joke:", result.improvedJoke)
    console.log("Judgment:", result.judgment)
    console.log("Final Verdict:", result.finalVerdict)
  } catch (error) {
    console.error("Error processing request:", error)
    return new Response("Error processing request", { status: 500 })
  }
}
