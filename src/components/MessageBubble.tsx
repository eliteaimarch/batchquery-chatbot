import React from 'react'
import type { ChatMessage } from '../types'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'

export default function MessageBubble({ msg }: { msg: ChatMessage }) {
  const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return (
    <div className={`rounded-xl border p-3 ${msg.role === 'user' ? 'bg-muted w-3/4 mr-auto' : 'bg-card w-3/4 ml-auto'}`}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <span>{msg.role === 'user' ? 'You' : 'Assistant'}</span>
        <span>•</span>
        <span>{time}</span>
        {msg.imageId && <><span>•</span><span>Image ID: {msg.imageId.slice(0,6)}</span></>}
        {msg.status === 'loading' && <><span>•</span><span>Processing…</span></>}
        {msg.status === 'error' && <><span>•</span><span className="text-red-300">Error</span></>}
      </div>
      {msg.images && msg.images.length > 0 && (
        <div className="flex gap-2 mb-2">
          {msg.images.map(im => (
            <img key={im.id} src={im.url} alt={im.name} className="w-20 h-20 rounded-md object-cover border" />
          ))}
        </div>
      )}
      <div className="whitespace-pre-wrap text-sm">
        {msg.role === 'assistant' ? (
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{msg.text}</ReactMarkdown>
        ) : (
          msg.text
        )}
      </div>
      {msg.error && <div className="mt-2 text-xs text-red-300 border border-red-400/40 bg-red-900/20 px-2 py-1 rounded">{msg.error}</div>}
    </div>
  )
}
