import React, { useEffect, useRef } from 'react'
import type { ChatMessage } from '../types'
import MessageBubble from './MessageBubble'

export default function ChatPane({ messages }: { messages: ChatMessage[] }) {
  const endRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto flex flex-col gap-3 p-2">
        {messages.map(m => <MessageBubble key={m.id} msg={m} />)}
        <div ref={endRef} />
      </div>
    </div>
  )
}
