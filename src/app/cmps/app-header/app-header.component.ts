import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [NgIf, AsyncPipe],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent {
  private router = inject(Router)
  private userService = inject(UserService);
  loggedInUser$ = this.userService.loggedInUser$;


  onLogin() {
    this.router.navigate(['/login'])
  }

  onLogout() {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
