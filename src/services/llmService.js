const fetch = require('node-fetch');

const SYSTEM_PROMPT = `You are a concise summarizer. Given any input text, produce a clear, 
accurate summary in 3–6 bullet points. Each bullet should start with "•". 
Do not add extra commentary outside the bullets. Keep each bullet under 30 words.`;

async function summarizeWithAnthropic(text) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Summarize the following text:\n\n${text}` }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    summary: data.content[0].text.trim(),
    model: data.model,
  };
}

async function summarizeWithOpenAI(text) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 512,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Summarize the following text:\n\n${text}` },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    summary: data.choices[0].message.content.trim(),
    model: data.model,
  };
}

async function summarize(text) {
  const provider = (process.env.LLM_PROVIDER || 'anthropic').toLowerCase();
  if (provider === 'openai') return summarizeWithOpenAI(text);
  return summarizeWithAnthropic(text);
}

module.exports = { summarize };
