import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from "../cmps/app-header/app-header.component";

import { LandingPageComponent } from "../pages/landing-page/landing-page.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeaderComponent, LandingPageComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gal-yad2';
  private router = inject(Router)

  isAuthPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/signup';
  }
}
