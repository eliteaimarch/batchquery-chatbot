import React, { useMemo, useState } from 'react'
import DropzoneUpload from './components/DropzoneUpload'
import ChatPane from './components/ChatPane'
import type { ChatMessage, ImageItem } from './types'
import { batchAskOpenAI, batchAskMock, type LLMResult } from './lib/llm'
import { Card, CardContent, CardHeader } from './components/ui/card'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'

export default function App() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [prompt, setPrompt] = useState('How many books are there in this image?')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [useRealLLM, setUseRealLLM] = useState(true)

  const canSend = images.length > 0 && prompt.trim().length > 0 && !busy

  function appendLog(line: string) {
    setLogs(prev => [line, ...prev].slice(0, 120))
    console.info("[log]", line)
  }
  function pushMessage(msg: ChatMessage) {
    setMessages(prev => [...prev, msg])
  }

  async function onSend() {
    setError(null)
    setBusy(true)

    const snapshot = images.map(img => ({ id: img.id, url: img.url, name: img.name }))

    pushMessage({
      id: crypto.randomUUID(),
      role: 'user',
      text: prompt.trim(),
      images: snapshot,
      timestamp: Date.now()
    })

    const placeholders: ChatMessage[] = images.map(img => ({
      id: crypto.randomUUID(),
      role: 'assistant',
      text: '',
      imageId: img.id,
      timestamp: Date.now(),
      status: 'loading'
    }))
    setMessages(prev => [...prev, ...placeholders])

    try {
      appendLog(`Batch x${images.length} | Model: ${useRealLLM ? 'OpenAI' : 'Mock'} | Prompt: "${prompt.trim()}"`)
      const results: LLMResult[] = useRealLLM
        ? await batchAskOpenAI(images, prompt.trim()) as LLMResult[]
        : await batchAskMock(images, prompt.trim()) as LLMResult[]

      setMessages(prev => prev.map(m => {
        if (m.role !== 'assistant' || !m.imageId) return m
        const r = results.find(x => 'imageId' in x && x.imageId === m.imageId)
        if (!r) return m
        if ('error' in r) {
          return { ...m, text: '', status: 'error', error: r.error }
        }
        return { ...m, text: r.answer, status: 'done' }
      }))

      appendLog("Batch completed.")
    } catch (e: any) {
      console.error(e)
      setError(e?.message ?? "Unexpected error while querying the model.")
      appendLog(`Error: ${e?.message ?? 'unknown'}`)
    } finally {
      setBusy(false)
    }
  }

  const header = useMemo(() => (
    <div className="flex items-baseline gap-3 mb-2">
      <h1 className="text-xl font-semibold">BatchQuery Chatbot</h1>
      <span className="text-sm text-muted-foreground">Ask one question across up to four images—see per-image answers.</span>
    </div>
  ), [])

  return (
    <div className="h-full p-4 grid grid-cols-1 lg:grid-cols-[420px,1fr] gap-4">
      <Card>
        <CardHeader>{header}</CardHeader>
        <CardContent className="space-y-4">
          <DropzoneUpload images={images} setImages={setImages} setError={setError} />
          {error && <div className="text-sm text-red-300 border border-red-400/40 bg-red-900/20 px-3 py-2 rounded">{error}</div>}

          <div className="flex gap-2">
            <Input
              placeholder="Ask a question about your product images…"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && canSend) onSend()
              }}
            />
            <Button onClick={onSend} disabled={!canSend}>
              {busy ? 'Sending…' : 'Send to All'}
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 select-none cursor-pointer">
              <input
                type="checkbox"
                className="accent-blue-500"
                checked={useRealLLM}
                onChange={e => setUseRealLLM(e.target.checked)}
              />
              Use real LLM (OpenAI) — falls back to mock if key missing
            </label>
            <span className="text-muted-foreground">Logs (most recent first)</span>
          </div>

          <div className="text-xs text-muted-foreground max-h-40 overflow-auto rounded border border-dashed p-2">
            {logs.length === 0 ? <div>No logs yet.</div> :
              <ul className="list-disc pl-5 space-y-1">
                {logs.map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            }
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader><div className="text-sm font-semibold">Conversation</div></CardHeader>
        <CardContent className="flex-1">
          <ChatPane messages={messages} />
        </CardContent>
      </Card>
    </div>
  )
}
