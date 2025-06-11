import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from "../cmps/app-header/app-header.component";

import { LandingPageComponent } from "../pages/landing-page/landing-page.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeaderComponent, LandingPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gal-yad2';
}
