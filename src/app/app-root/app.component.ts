import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from "../cmps/app-header/app-header.component";
import { BubblesCategoryComponent } from "../cmps/bubbles-category/bubbles-category.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeaderComponent, BubblesCategoryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gal-yad2';
}
