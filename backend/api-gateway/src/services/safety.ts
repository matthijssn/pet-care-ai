export function redactPII(text: string): string {
  if (!text) return text;
  // simple email redaction
  let out = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
  // simple phone redaction
  out = out.replace(/\+?\d[\d \-().]{7,}\d/g, '[REDACTED_PHONE]');
  // SSN-like patterns
  out = out.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_SSN]');
  return out;
}
