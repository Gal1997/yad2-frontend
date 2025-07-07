import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class SignupComponent {
  signupForm: FormGroup;
  passwordVisible = false;
  confirmPasswordVisible = false;
  private userService = inject(UserService)
  private router = inject(Router)
  loginErrorMsg: String = "";

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(3)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(3)]]
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  passwordsMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.signupForm.invalid) return;
    const credentials = this.signupForm.value;
    console.log('Signup credentials:', credentials);
    this.userService.signup(credentials).subscribe({
      next: (user) => {
        console.log('Signup success:', user);
        this.loginErrorMsg = "";
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Signup failed:', err);
        this.loginErrorMsg = err.error.err;
      }
    });

  }
}
