const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { summarizeText } = require('../controllers/llmController');
const { authenticate } = require('../middleware/auth');

const llmLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many summarize requests. Please wait a minute before trying again.' },
});

router.post('/summarize', authenticate, llmLimiter, summarizeText);

module.exports = router;
