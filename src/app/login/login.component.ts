// login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class LoginComponent {
  loginForm : any;
  loginValid = true;

  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private fb : FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({    
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => { 
        this.loginValid = true;
        this.router.navigate(['/dashboard'])
      },
      error: (err) => {
        this.loginValid = false;
        this.error = 'Login mislukt'
      }
    });
  }
}
