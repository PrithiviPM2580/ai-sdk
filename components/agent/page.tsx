"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useMemo, useState } from "react"
import { WeatherAgentMessage } from "@/app/api/practice/agent/route"

function ToolStatePill({
  label,
  tone = "muted",
}: {
  label: string
  tone?: "muted" | "live" | "done" | "error"
}) {
  const toneClasses = {
    muted:
      "border-zinc-200 bg-white/70 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400",
    live: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300",
    done: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
    error:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide ${toneClasses[tone]}`}
    >
      {label}
    </span>
  )
}

function ToolBlock({
  title,
  icon,
  state,
  input,
  output,
  errorText,
}: {
  title: string
  icon: string
  state: string
  input?: unknown
  output?: unknown
  errorText?: string
}) {
  const tone =
    state === "output-error"
      ? "error"
      : state === "output-available"
        ? "done"
        : state === "input-available"
          ? "live"
          : "muted"

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950/70">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-sm text-white dark:bg-white dark:text-zinc-950">
            {icon}
          </span>
          <div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {title}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Tool execution state
            </div>
          </div>
        </div>
        <ToolStatePill label={state.replace(/-/g, " ")} tone={tone} />
      </div>

      <div className="space-y-3 px-4 py-4">
        {input !== undefined && (
          <div>
            <div className="mb-1 text-[11px] font-medium tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
              Input
            </div>
            <pre className="overflow-x-auto rounded-xl bg-zinc-950 px-3 py-2 text-xs leading-5 text-zinc-100 dark:bg-black/40">
              {JSON.stringify(input, null, 2)}
            </pre>
          </div>
        )}

        {output !== undefined && (
          <div>
            <div className="mb-1 text-[11px] font-medium tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
              Output
            </div>
            <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:bg-emerald-950/35 dark:text-emerald-100">
              {typeof output === "string"
                ? output
                : JSON.stringify(output, null, 2)}
            </div>
          </div>
        )}

        {errorText && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/35 dark:text-rose-100">
            {errorText}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Agent() {
  const [input, setInput] = useState("")

  const { messages, sendMessage, status, stop, error } =
    useChat<WeatherAgentMessage>({
      transport: new DefaultChatTransport({
        api: "/api/practice/agent",
      }),
    })

  const isBusy = status === "submitted" || status === "streaming"

  const lastMessageLabel = useMemo(() => {
    if (!messages.length) return "Ready to ask for weather"
    return isBusy ? "Thinking and calling tools" : "Conversation updated"
  }, [isBusy, messages.length])

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white/85 px-6 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur sm:px-8 sm:py-8 dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.025)_1px,transparent_1px)] bg-size-[24px_24px] opacity-60 dark:bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] dark:opacity-35" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium tracking-wide text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300">
                  Tool loop agent
                </span>
                <span className="inline-flex rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs font-medium tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300">
                  OpenRouter powered
                </span>
              </div>

              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
                  Weather agent with tool reasoning
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base dark:text-zinc-400">
                  Ask for weather in a city, watch the agent call weather and
                  conversion tools, and see each step rendered clearly.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:w-96">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/90 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="text-xs tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
                  Status
                </div>
                <div className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {lastMessageLabel}
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/90 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="text-xs tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
                  Mode
                </div>
                <div className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Multi-step tool loop
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/90 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="text-xs tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
                  Provider
                </div>
                <div className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  OpenRouter free model
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="mt-6 grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <section className="flex min-h-96 flex-col overflow-hidden rounded-[2rem] border border-zinc-200 bg-white/85 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <div>
                <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  Conversation
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Messages and tool calls appear in chronological order
                </div>
              </div>
              {error && (
                <div className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
                  {error.message}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {!messages.length ? (
                <div className="grid h-full place-items-center rounded-[1.5rem] border border-dashed border-zinc-200 bg-zinc-50/70 px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/35">
                  <div className="max-w-sm space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                      ☁
                    </div>
                    <div className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                      Start with a city name
                    </div>
                    <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      Try something like “What is the weather in Kathmandu in
                      celsius?”
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <article
                    key={message.id}
                    className={`max-w-184 ${message.role === "user" ? "ml-auto" : "mr-auto"}`}
                  >
                    <div
                      className={`rounded-[1.5rem] border px-4 py-4 shadow-sm sm:px-5 ${message.role === "user" ? "border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-900/60 dark:bg-sky-950/35 dark:text-sky-50" : "border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/75 dark:text-zinc-50"}`}
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 text-xs font-semibold text-white dark:bg-white dark:text-zinc-950">
                            {message.role === "user" ? "You" : "AI"}
                          </span>
                          <div>
                            <div className="text-sm font-semibold">
                              {message.role === "user" ? "You" : "Agent"}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                              {message.role === "user"
                                ? "Prompt"
                                : "Reasoned response"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {message.parts.map((part, index) => {
                          switch (part.type) {
                            case "text":
                              return (
                                <div
                                  key={`${message.id}-text-${index}`}
                                  className="text-sm leading-6 whitespace-pre-wrap sm:text-[15px]"
                                >
                                  {part.text}
                                </div>
                              )

                            case "tool-getWeather":
                              return (
                                <ToolBlock
                                  key={`${message.id}-tool-getWeather-${index}`}
                                  title="Get Weather"
                                  icon="☁"
                                  state={part.state}
                                  input={part.input}
                                  output={part.output}
                                  errorText={part.errorText}
                                />
                              )

                            default:
                              return null
                          }
                        })}
                      </div>
                    </div>
                  </article>
                ))
              )}

              {isBusy && (
                <div className="flex items-center gap-3 px-2 pb-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-500" />
                  Thinking and calling tools...
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!input.trim()) return
                sendMessage({ text: input })
                setInput("")
              }}
              className="border-t border-zinc-200 bg-zinc-50/90 p-4 dark:border-zinc-800 dark:bg-zinc-950/80"
            >
              <div className="flex gap-3 rounded-[1.4rem] border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for weather, then let the agent use tools..."
                  className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
                />

                {isBusy ? (
                  <button
                    type="button"
                    onClick={stop}
                    className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-600"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={status !== "ready" || !input.trim()}
                    className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                  >
                    Send
                  </button>
                )}
              </div>
            </form>
          </section>

          <aside className="space-y-4">
            <div className="rounded-[1.6rem] border border-zinc-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
              <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Example prompts
              </div>
              <div className="mt-3 space-y-3">
                {[
                  "What is the weather in Kathmandu in celsius?",
                  "Convert 82 Fahrenheit to Celsius",
                  "Weather in Pokhara and then convert it",
                ].map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setInput(example)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left text-sm text-zinc-700 transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-sky-900/60 dark:hover:bg-sky-950/25 dark:hover:text-sky-200"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-zinc-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
              <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                What this page shows
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                <li>• User messages on the right</li>
                <li>• Agent replies with readable tool output cards</li>
                <li>• Live state while the model is thinking</li>
                <li>• Sticky composer with stop support</li>
              </ul>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}
