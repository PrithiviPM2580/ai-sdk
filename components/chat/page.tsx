"use client"

import { useChat } from "@ai-sdk/react"
import React, { useState } from "react"

export default function Chat() {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status, stop, error } = useChat()

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    sendMessage({ text: input })
    setInput("")
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
              {error && <span className="text-red-400">{error.message}</span>}
              {messages.map((msg) => (
                <div className="" key={msg.id}>
                  <div className="">
                    {msg.role === "user" ? "You: " : "AI: "}
                  </div>
                  {msg.parts.map((part, index) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <div className="" key={`${msg.id}-${index}`}>
                            {part.text}
                          </div>
                        )
                      default:
                        return null
                    }
                  })}
                </div>
              ))}
              {(status === "submitted" || status === "streaming") && (
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-400"></div>
                  </div>
                </div>
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your prompt..."
            className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          {status === "submitted" || status === "streaming" ? (
            <button
              onClick={stop}
              className="rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={status !== "ready"}
            >
              Send
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
