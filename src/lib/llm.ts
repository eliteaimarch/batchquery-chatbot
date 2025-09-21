/// <reference types="vite/client" />
import type { ImageItem } from '../types'
import OpenAI from 'openai'

export type LLMResult = { imageId: string; answer: string } | { imageId: string; error: string }

const cannedFindings = [
  "No obvious defects; lighting is consistent and background looks clean.",
  "Minor glare detected near the top edge; consider diffusing the light source.",
  "Slight color cast compared to typical product imagery; white balance could be improved.",
  "Cropping could be tighter to center the subject; small empty space on the right.",
  "Possible smudge/fingerprint on the lower-right; recommend re-shoot or retouch.",
  "The item appears new; no visible wear or scratches.",
  "Composition is strong; diagonals lead the eye to the subject.",
  "Detected multiple similar items; ensure this aligns with listing guidelines."
];

function pretendModelAnswer(prompt: string, imgName: string) {
  const pick = cannedFindings[Math.floor(Math.random() * cannedFindings.length)];
  return `Q: ${prompt}\nA: ${pick} (based on \"${imgName}\")`;
}

export async function batchAskMock(images: ImageItem[], prompt: string) {
  const tasks = images.map(img => new Promise((resolve) => {
    const latency = 400 + Math.random() * 1200;
    setTimeout(() => {
      if (Math.random() < 0.08) {
        resolve({ imageId: img.id, error: "Temporary model error. Please retry." })
      } else {
        resolve({ imageId: img.id, answer: pretendModelAnswer(prompt, img.name) })
      }
    }, latency);
  }));
  return Promise.all(tasks)
}

const apiKey = import.meta.env.OPENAI_API_KEY
const model = import.meta.env.OPENAI_VISION_MODEL || "gpt-4o-mini"

let client: OpenAI | null = null
if (apiKey) {
  client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
}

export async function batchAskOpenAI(images: ImageItem[], prompt: string) {
  if (!client) {
    return batchAskMock(images, prompt)
  }
  const tasks = images.map(async (img) => {
    try {
        const dataUrl = await fileToDataUrl(img.file)
        const res = await client!.responses.create({
          model,
          input: [
            {
              role: "user",
              content: [
                { type: "input_text", text: prompt },
                { type: "input_image", image_url: dataUrl, detail: "auto" }
              ]
            }
          ]
        })
      const text = (res as any).output_text ?? "(No text returned)"
      return { imageId: img.id, answer: text }
    } catch (e: any) {
      return { imageId: img.id, error: e?.message ?? "Unknown error" }
    }
  })
  return Promise.all(tasks)
}

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const bytes = new Uint8Array(buf)
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode.apply(null, Array.from(chunk) as any)
  }
  return btoa(binary)
}

async function fileToDataUrl(file: File): Promise<string> {
  const b64 = await fileToBase64(file)
  return `data:${file.type};base64,${b64}`
}
