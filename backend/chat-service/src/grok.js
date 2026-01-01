// Minimal Grok AI provider wrapper.
// Expects env vars: GROK_API_URL, GROK_API_KEY (secret).
// Attempts to POST { messages } to GROK_API_URL and pipe streaming response (SSE or text) to the passed express `res`.

const DEFAULT_TIMEOUT = 120_000;

// Enforce free-tier model usage by default. Use GROK_FREE_MODEL env var to control allowed free model.
const FREE_MODEL = process.env.GROK_FREE_MODEL || 'grok-mini';
const MAX_TOKENS = Number(process.env.GROK_MAX_TOKENS || 512);

async function streamToGrokAndPipe(body, res) {
  const url = process.env.GROK_API_URL;
  const key = process.env.GROK_API_KEY;
  if (!url) throw new Error('GROK_API_URL not configured');

  const headers = {
    'Content-Type': 'application/json',
  };
  if (key) headers['Authorization'] = `Bearer ${key}`;

  // Build provider payload and enforce free model / token limits. Ignore any model passed by client.
  const payload = {
    model: FREE_MODEL,
    messages: body.messages || [],
    stream: true,
    max_tokens: MAX_TOKENS,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  const upstream = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => '');
    const err = new Error(`Grok upstream error: ${upstream.status} ${upstream.statusText} ${text}`);
    throw err;
  }

  // Try to pipe body stream to response if possible
  if (upstream.body && typeof upstream.body.pipe === 'function') {
    upstream.body.pipe(res);
  } else if (upstream.body && typeof upstream.body.getReader === 'function') {
    // Web stream -> read and forward chunks as-is
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      try { res.write(chunk); } catch (e) { /* ignore write errors */ }
    }
  } else {
    // Fallback: read text and send
    const text = await upstream.text();
    res.write(text);
  }
}

module.exports = { streamToGrokAndPipe };
