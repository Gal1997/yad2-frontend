import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { CardComponent } from "../../cmps/card/card.component";
import { HouseService } from '../../services/house.service';
import House from '../../models/house';


@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, CarouselModule, CardComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  standalone: true
})
export class LandingPageComponent implements OnInit {
  products: House[] = [];
  private houseService = inject(HouseService);

  ngOnInit() {
    this.houseService.getAll().subscribe({
      next: data => {
        this.products = data;
      },
      error: err => {
        console.error('Error fetching data:', err);
      }
    });
  }


}
