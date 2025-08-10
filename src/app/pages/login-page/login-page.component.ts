import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginPageComponent {
  loginForm: FormGroup;
  passwordVisible = false;
  private userService = inject(UserService);
  private router = inject(Router);
  loginError: boolean = false;

  constructor(private fb: FormBuilder) {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navEntry?.type !== 'reload') {
      location.reload();
    }


    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.loginForm.statusChanges.subscribe(status => {
      if (status === 'INVALID') this.loginError = false;
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.userService.login(credentials).subscribe({
        next: (response) => {
          this.router.navigate(['/home']);
          this.loginError = false;
        },
        error: () => {
          this.loginError = true;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }


}




