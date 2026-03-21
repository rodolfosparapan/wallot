// ─── Replace with your OpenAI API key ────────────────────────────────────────
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? 'YOUR_OPENAI_KEY'
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = 'https://api.openai.com/v1'

// ── Parse a text entry (typed or from voice) ─────────────────────────────────
export async function parseTextEntry(text: string) {
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a financial assistant for the Wallot app. 
          Extract financial entry data from user messages.
          Always respond with valid JSON only, no markdown.
          JSON format: { "type": "expense"|"income", "amount": number, "category": "food"|"housing"|"transport"|"health"|"shopping"|"entertainment"|"education"|"other", "description": string }
          Categories guide: food=meals/groceries, housing=rent/utilities, transport=uber/fuel/bus, health=pharmacy/doctor, shopping=clothes/electronics, entertainment=movies/games, education=courses/books.`,
        },
        { role: 'user', content: text },
      ],
      max_tokens: 200,
    }),
  })

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  return JSON.parse(content)
}

// ── Transcribe audio using Whisper ───────────────────────────────────────────
export async function transcribeAudio(audioUri: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'audio.m4a',
  } as any)
  formData.append('model', 'whisper-1')
  formData.append('language', 'pt') // Portuguese by default, Whisper auto-detects

  const response = await fetch(`${BASE_URL}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: formData,
  })

  const data = await response.json()
  return data.text ?? ''
}

// ── Parse a receipt image using GPT-4o Vision ────────────────────────────────
export async function parseReceiptImage(base64Image: string) {
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a receipt scanner for the Wallot finance app.
          Extract the total amount and merchant type from the receipt image.
          Always respond with valid JSON only, no markdown.
          JSON format: { "type": "expense", "amount": number, "category": "food"|"housing"|"transport"|"health"|"shopping"|"entertainment"|"education"|"other", "description": string }`,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract the financial data from this receipt.' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          ],
        },
      ],
      max_tokens: 300,
    }),
  })

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  return JSON.parse(content)
}

// ── AI Insights chat ──────────────────────────────────────────────────────────
export async function askInsights(
  question: string,
  financialContext: string
): Promise<string> {
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are Wallot, a friendly and smart personal finance AI assistant.
          Answer questions about the user's finances based on the data provided.
          Be concise, friendly, and give actionable advice.
          Always respond in the same language as the user's question.
          Financial data: ${financialContext}`,
        },
        { role: 'user', content: question },
      ],
      max_tokens: 400,
    }),
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content ?? 'Sorry, I could not process that.'
}
