

// pages/api/analyze.js
// Anthropic API proxy â€” API key tarayÄ±cÄ±ya aÃ§Ä±lmaz, Vercel env'de saklanÄ±r

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sadece POST desteklenir' })
  }

  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'prompt alanÄ± zorunlu' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(response.status).json({ error: err })
    }

    const data = await response.json()
    return res.status(200).json(data)

  } catch (err) {
    console.error('Anthropic API hatasÄ±:', err)
    return res.status(500).json({ error: err.message })
  }
}
