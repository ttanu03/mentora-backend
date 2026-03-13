const { summarize } = require('../services/llmService');

const MIN_LENGTH = 50;
const MAX_LENGTH = 10000;

exports.summarizeText = async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'text is required and must be a non-empty string' });
  }
  if (text.trim().length < MIN_LENGTH) {
    return res.status(400).json({ error: `text must be at least ${MIN_LENGTH} characters long` });
  }
  if (text.length > MAX_LENGTH) {
    return res.status(413).json({ error: `text exceeds maximum allowed length of ${MAX_LENGTH} characters` });
  }

  try {
    const result = await summarize(text.trim());
    res.json(result);
  } catch (err) {
    console.error('LLM error:', err.message);
    res.status(502).json({ error: 'Failed to get response from LLM provider', details: err.message });
  }
};
