import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [NgIf, AsyncPipe, MatMenuModule, MatButtonModule, RouterModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent {
  private router = inject(Router)
  private userService = inject(UserService);
  loggedInUser$ = this.userService.loggedInUser$;

  onLogout() {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
