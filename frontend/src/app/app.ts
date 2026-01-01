import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChatDialogComponent } from './chat/chat-dialog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule, ChatDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('smart-pet-care-client');

  constructor(private dialog: MatDialog) {}

  openChat() {
    this.dialog.open(ChatDialogComponent, {
      width: 'min(64rem, 100vw)',
      maxWidth: '100vw',
      autoFocus: 'dialog',
      restoreFocus: true,
      panelClass: 'petcare-chat-dialog',
      ariaLabel: 'PetCare AI chat',
    });
  }
}
