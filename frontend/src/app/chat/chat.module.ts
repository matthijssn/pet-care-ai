import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { ChatDialogComponent } from './chat-dialog.component';

@NgModule({
  //declarations: [ChatDialogComponent],
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, ScrollingModule],
  //exports: [ChatDialogComponent],
})
export class ChatModule {}
