"use client"

import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input"

import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Fragment } from "react"
import { Spinner } from "@/components/ui/spinner"

export default function RagChatBot() {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status } = useChat()

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text) return
    sendMessage({
      text: message.text,
    })
    setInput("")
  }
  return (
    <div className="relative mx-auto size-full h-[calc(100vh-4rem)] max-w-4xl p-6">
      <div className="flex h-full flex-col">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <MessageResponse>{part.text}</MessageResponse>
                            </MessageContent>
                          </Message>
                        </Fragment>
                      )
                    default:
                      return null
                  }
                })}
              </div>
            ))}
            {(status === "submitted" || status === "streaming") && <Spinner />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </PromptInputBody>

          <PromptInputTools>
            {/* Model selector, web search, etc. */}
          </PromptInputTools>
          <PromptInputSubmit disabled={!input && !status} status={status} />
        </PromptInput>
      </div>
    </div>
  )
}
