// login.component.ts
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule 
  ]
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  loginValid = true;
  backendHealthy = false;

  error = '';
  // MFA state
  mfaPending = false;
  mfaToken: string | null = null;
  mfaCode = '';

  constructor(private authService: AuthService, private fb : FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({    
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.checkHealth().subscribe({
      next: () => {
        this.backendHealthy = true;
      },
      error: () => {
        this.backendHealthy = false;
        this.error = 'Authentication service is currently unavailable.';
      }
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        this.loginValid = true;
        // If the server asks for MFA, show the code input and keep mfaToken
        if (res?.mfaRequired && res?.mfaToken) {
          this.mfaPending = true;
          this.mfaToken = res.mfaToken;
          return;
        }

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loginValid = false;
        // Prefer server-provided message when available
        this.error = err?.error?.message || 'Login mislukt';
      }
    });
  }

  onVerifyMfa() {
    if (!this.mfaToken || !this.mfaCode) return;
    this.authService.mfaLoginVerify(this.mfaToken, this.mfaCode).subscribe({
      next: () => {
        this.mfaPending = false;
        this.mfaToken = null;
        this.mfaCode = '';
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Invalid MFA code';
      }
    });
  }
}
