import { z } from "zod"

export const recipeSchema = z.object({
  recipe: z
    .object({
      name: z.string().describe("The name of the recipe"),
      ingredients: z
        .array(
          z
            .object({
              name: z.string().describe("The name of the ingredient"),
              amount: z
                .string()
                .describe(
                  "The amount of the ingredient, e.g., '2 cups' or '1 tablespoon'"
                ),
            })
            .describe("An ingredient in the recipe")
        )
        .describe("The list of ingredients in the recipe"),
      steps: z
        .array(z.string().describe("A step in the recipe instructions"))
        .describe("The list of steps to prepare the recipe"),
    })
    .describe("The structure of a recipe object"),
})
