"use client"

import { recipeSchema } from "@/validators"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import React, { useState } from "react"

export default function StructureOutput() {
  const [dishName, setDishName] = useState("")
  const { object, error, isLoading, submit, stop } = useObject({
    api: "/api/structure-object",
    schema: recipeSchema,
  })

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    submit({ dish: dishName })
    setDishName("")
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-linear-to-br from-slate-950 to-slate-900 p-4">
      <div className="flex h-[80%] w-full max-w-2xl flex-col justify-between rounded-lg border border-slate-700 bg-slate-800 shadow-lg">
        {/* Chat Header */}
        <div className="border-b border-slate-700 px-6 py-4">
          <div className="text-lg font-semibold text-white">
            AI Completion Stream
          </div>
        </div>

        {/* Output Area */}
        <div className="mx-auto flex w-full max-w-2xl flex-col pt-12 pb-24">
          {error && <div className="text-red-500">{error.message}</div>}
          {object?.recipe && (
            <div className="space-y-6 px-4">
              <h2 className="text-2xl font-bold">{object.recipe.name}</h2>

              {object?.recipe?.ingredients && (
                <div>
                  <h3 className="mb-4 text-xl font-semibold">Ingredients</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {object.recipe.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800"
                      >
                        <p className="font-medium">{ingredient?.name}</p>
                        <p className="text-zinc-600 dark:text-zinc-400">
                          {ingredient?.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {object?.recipe?.steps && (
                <div>
                  <h3 className="mb-4 text-xl font-semibold">Steps</h3>
                  <ol className="space-y-4">
                    {object.recipe.steps.map((step, index) => (
                      <li
                        key={index}
                        className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800"
                      >
                        <span className="mr-2 font-medium">{index + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center gap-2 border-t border-slate-700 px-6 py-4"
        >
          <input
            type="text"
            name="prompt"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            placeholder="Enter your prompt..."
            className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          {isLoading ? (
            <button
              type="button"
              onClick={stop}
              className="mt-2 h-full rounded-lg bg-blue-600 px-8 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading || !dishName}
              className="mt-2 h-full rounded-lg bg-blue-600 px-8 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
