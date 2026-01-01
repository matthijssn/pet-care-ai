import express from 'express';
import cors from 'cors';
import { streamToGrokAndPipe } from './grok';

const app = express();
app.use(cors());
app.use(express.json());

function redactPII(text?: string) {
  if (!text) return text;
  let out = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
  out = out.replace(/\+?\d[\d \-().]{7,}\d/g, '[REDACTED_PHONE]');
  out = out.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_SSN]');
  return out;
}

app.post('/api/chat', (req, res) => {
  const { messages } = req.body ?? {};
  const safeMessages = redactPII(JSON.stringify(messages || []));
  console.log('Chat request (redacted):', safeMessages);

  const grokUrl = process.env.GROK_API_URL;
  if (grokUrl) {
    // Forward streaming request to configured Grok AI provider
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    streamToGrokAndPipe({ messages }, res).catch((err: any) => {
      console.error('Grok stream error', err && err.message);
      try { res.write(`data: ${JSON.stringify({ error: 'grok failed' })}\n\n`); } catch (e) {}
      try { res.end(); } catch (e) {}
    });
    return;
  }

  // Fallback: simulate streaming response
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const systemIntro = 'I am PetCare AI. I am not a veterinarian. I can suggest potential causes and when to seek urgent care.';

  const tokens = [
    systemIntro,
    '\nPotential causes to consider:\n- Gastrointestinal upset\n- Dietary indiscretion\n- Toxin exposure (see safety guidance)\n',
    '\nIf you see seizures, collapse, severe breathing difficulty, or bloating in dogs, seek immediate veterinary care.\n',
    '\nThis is not a diagnosis. Contact your veterinarian for medical advice.\n',
  ];

  let i = 0;
  const interval = setInterval(() => {
    if (i >= tokens.length) {
      res.write('data: [DONE]\n\n');
      res.end();
      clearInterval(interval);
      return;
    }
    res.write(`data: ${tokens[i]}\n\n`);
    i += 1;
  }, 250);

  req.on('close', () => {
    clearInterval(interval);
    try { res.end(); } catch (e) {}
  });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`PetCare Chat Service running on http://0.0.0.0:${PORT}`);
});
