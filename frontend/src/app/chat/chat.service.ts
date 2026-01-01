import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessage, PetContext } from './chat.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  
  private url(path: string) {
    return `${environment.baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }
  
  streamChat(history: ChatMessage[], petContext?: PetContext): Observable<ChatMessage> {
    return new Observable<ChatMessage>((observer) => {
      const controller = new AbortController();
      fetch(this.url('api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, petContext }),
        signal: controller.signal,
      })
        .then(async (res) => {
          if (!res.body) {
            observer.error(new Error('No stream available'));
            return;
          }
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let assistant: ChatMessage = { role: 'assistant', content: '', timestamp: new Date().toISOString() };
          observer.next(assistant);

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            // split on SSE event delimiter (\n\n)
            const parts = buffer.split('\n\n');
            buffer = parts.pop() || '';

            for (const part of parts) {
              // each part may contain lines like "data: ..."
              const lines = part.split('\n');
              for (const line of lines) {
                const m = line.match(/^data: ?(.*)$/s);
                if (!m) continue;
                const data = m[1];
                if (data === '[DONE]') {
                  observer.complete();
                  return;
                }
                // append token
                assistant.content += data;
                assistant.timestamp = new Date().toISOString();
                observer.next({ ...assistant });
              }
            }
          }
          observer.complete();
        })
        .catch((err) => {
          observer.error(err);
        });

      return () => controller.abort();
    });
  }
}
