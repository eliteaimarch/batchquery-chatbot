# BatchQuery Chatbot

Minimal README for the BatchQuery Chatbot demo (Vite + React + Tailwind + shadcn/ui).

## Requirements
- Node.js 18+ (or compatible)
- npm (or pnpm/yarn)

## Setup
1. Install dependencies

PowerShell:

```powershell
npm install
```

2. Provide environment variables

Create a `.env` (or set system env vars) with the following:

```
OPENAI_API_KEY=your_api_key_here
OPENAI_VISION_MODEL=gpt-4o-mini
```

## Run

PowerShell:

```powershell
npm run dev
```

Open your browser at the address shown by Vite (usually `http://localhost:5173`).

## Features
- Upload images and run batch queries against an LLM (OpenAI Responses API or a local mock when no API key is present).
- Assistant responses render as Markdown in the chat UI.

## Notes
- The app sends images as data URLs to the OpenAI Responses API when an API key is present. Keep an eye on payload sizes; for many large images, consider uploading to a hosted URL instead.
- If you see TypeScript errors about `react-markdown` or `rehype-sanitize`, install the packages shown above and restart the dev server.

## Testing
- Upload an image and enter a prompt; assistant replies should appear formatted if they contain Markdown.
