import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmLogoutDialogComponent } from './confirm-logout-dialog.component';
import { AuthService } from '../core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) { }

  logout() {
    const dialogRef = this.dialog.open(ConfirmLogoutDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Logging out user from layout component');
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }


}
