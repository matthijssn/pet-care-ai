import express from 'express';
import { redactPII } from '../services/safety';

export const chatRouter = express.Router();

// Proxy POST /api/chat to dedicated chat service defined by CHAT_SERVICE_URL
chatRouter.post('/', express.json(), async (req, res) => {
  const { messages } = req.body ?? {};
  const safeMessages = redactPII(JSON.stringify(messages || []));
  console.log('Forwarding chat request (redacted):', safeMessages);

  const chatServiceUrl = process.env.CHAT_SERVICE_URL || 'http://localhost:4000/api/chat';

  try {
    const upstream = await fetch(chatServiceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    // Forward status and selected headers
    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Pipe response body (streaming SSE) to client
    if (upstream.body) {
      const reader = upstream.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      } catch (err) {
        console.error('Error reading response stream:', err);
        res.status(502).json({ error: 'Chat service unavailable' });
      }
    } else {
      // Fallback: read fully and send
      const text = await upstream.text();
      res.send(text);
    }
  } catch (err) {
    console.error('Error proxying to chat service:', err);
    res.status(502).json({ error: 'Chat service unavailable' });
  }
});
