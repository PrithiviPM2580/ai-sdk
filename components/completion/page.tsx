"use client"

import React, { useState } from "react"

export default function CompletionPage() {
  const [prompt, setPrompt] = useState("")
  const [completion, setCompletion] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)
    setError("")

    const currentPrompt = prompt

    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: currentPrompt }),
      })

      if (!response.ok) {
        throw new Error("Request failed")
      }

      const data = await response.json()
      setCompletion(data.text)

      setPrompt("") // clear after success
    } catch (error) {
      setError("Failed to get completion.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex h-screen w-full items-center justify-center bg-linear-to-br from-slate-950 to-slate-900 p-4">
      <div className="flex h-[80%] w-full max-w-2xl flex-col justify-between rounded-lg border border-slate-700 bg-slate-800 shadow-lg">
        {/* Chat Header */}
        <div className="border-b border-slate-700 px-6 py-4">
          <div className="text-lg font-semibold text-white">AI Completion</div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600">
              <span className="text-sm font-semibold text-white">AI</span>
            </div>
            <div className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-100">
              {loading ? (
                "Generating response..."
              ) : error ? (
                <span className="text-red-400">{error}</span>
              ) : completion ? (
                completion
              ) : (
                "No response yet."
              )}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center gap-2 border-t border-slate-700 px-6 py-4"
        >
          <input
            type="text"
            name="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="mt-2 h-full rounded-lg bg-blue-600 px-8 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
