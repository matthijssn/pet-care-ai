import { Response } from 'express';

const DEFAULT_TIMEOUT = 120_000;

const FREE_MODEL = process.env.GROK_FREE_MODEL || 'grok-mini';
const MAX_TOKENS = Number(process.env.GROK_MAX_TOKENS || 512);

export async function streamToGrokAndPipe(body: any, res: Response): Promise<void> {
  const url = process.env.GROK_API_URL;
  const key = process.env.GROK_API_KEY;
  if (!url) throw new Error('GROK_API_URL not configured');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (key) headers['Authorization'] = `Bearer ${key}`;

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
    throw new Error(`Grok upstream error: ${upstream.status} ${upstream.statusText} ${text}`);
  }

  // Pipe/forward response
  // Node's response may be a stream with .pipe; handle Web ReadableStream as well
  // @ts-ignore
  if (upstream.body && typeof (upstream.body as any).pipe === 'function') {
    // @ts-ignore
    (upstream.body as any).pipe(res);
  } else if (upstream.body && typeof (upstream.body as any).getReader === 'function') {
    const reader = (upstream.body as any).getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      try { res.write(chunk); } catch (e) { }
    }
  } else {
    const text = await upstream.text();
    res.write(text);
  }
}
