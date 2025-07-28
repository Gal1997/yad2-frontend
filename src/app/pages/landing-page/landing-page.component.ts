import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { CardComponent } from "../../cmps/card/card.component";
import { HouseService } from '../../services/house.service';
import House from '../../models/house';
import { VehicleService } from '../../services/vehicle.service';
import Vehicle from '../../models/vehicle';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, CarouselModule, CardComponent, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  standalone: true
})
export class LandingPageComponent implements OnInit {
  allHouses: House[] = [];
  allVehicles: Vehicle[] = [];
  private houseService = inject(HouseService);
  private vehicleService = inject(VehicleService)
  private router = inject(Router)

  ngOnInit() {
    this.houseService.getAll().subscribe({
      next: data => {
        this.allHouses = data;
      },
      error: err => {
        console.error('Error fetching data:', err);
      }
    });

    this.vehicleService.getAll().subscribe({
      next: data => {
        this.allVehicles = data;
      },
      error: err => {
        console.error('Error fetching data:', err);
      }
    });
  }


  bannerClick() {
    this.router.navigate(['/publish'])
  }


}
