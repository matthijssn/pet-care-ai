import { Component, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChatMessage, PetContext } from './chat.models';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, ScrollingModule],
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatDialogComponent {
  messages: ChatMessage[] = [];
  pet?: PetContext;
  composer = '';
  streaming = false;
  urgent = false;

  constructor(
    public dialogRef: MatDialogRef<ChatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) {
    if (data?.pet) this.pet = data.pet;
  }

  close() {
    this.dialogRef.close();
  }

  send() {
    const text = (this.composer || '').trim();
    if (!text) return;

    // urgent keyword detection
    const urgentKeywords = ['chocolate', 'xylitol', 'seizure', 'bloat', 'gdv', 'collapse', 'poison', 'antifreeze'];
    this.urgent = urgentKeywords.some((k) => text.toLowerCase().includes(k));

    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: new Date().toISOString() };
    this.messages = [...this.messages, userMsg];
    this.composer = '';
    this.streaming = true;
    this.cdr.markForCheck();

    const history = [...this.messages];
    const sub = this.chatService.streamChat(history, this.pet).subscribe({
      next: (assistant) => {
        // if last message is assistant, replace it; otherwise push
        const last = this.messages[this.messages.length - 1];
        if (!last || last.role !== 'assistant') {
          this.messages = [...this.messages, assistant];
        } else {
          const updated = [...this.messages];
          updated[updated.length - 1] = assistant;
          this.messages = updated;
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Stream error', err);
        this.streaming = false;
        this.cdr.markForCheck();
      },
      complete: () => {
        this.streaming = false;
        this.cdr.markForCheck();
      },
    });
  }
}
