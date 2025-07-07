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
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    // If login credentials are invalid, don't show the loginError (incorrect details) error
    this.loginForm.statusChanges.subscribe(status => {
      if (status === 'INVALID') {
        this.loginError = false;
      }
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
      console.log("User entered ", credentials);

      this.userService.login(credentials).subscribe({
        next: (response) => {
          // successful login
          console.log('Login successful', response);
          this.router.navigate(['/home']);
          this.loginError = false;
        },
        error: (error) => {
          // Handle error
          console.error('Login failed', error.error);
          this.loginError = true;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }



}

