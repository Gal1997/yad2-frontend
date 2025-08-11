import { Component, inject, OnInit } from '@angular/core';
import { MapComponent } from '../../cmps/map/map.component';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { CardComponent } from "../../cmps/card/card.component";
import { HouseService } from '../../services/house.service';
import House from '../../models/house';
import { VehicleService } from '../../services/vehicle.service';
import Vehicle from '../../models/vehicle';
import { Router, RouterModule } from '@angular/router';
import Yad2 from '../../models/yad2';
import { Yad2Service } from '../../services/yad2.service';

@Component({
  selector: 'app-nadlan-page',
  imports: [MapComponent, CommonModule, CarouselModule, CardComponent, RouterModule],
  templateUrl: './nadlan-page.component.html',
  styleUrl: './nadlan-page.component.scss'
})
export class NadlanPageComponent implements OnInit {

  private houseService = inject(HouseService)
  allHouses: House[] = [];
  places: { city: string, street: string, number: number }[] = [];



  ngOnInit() {
    this.houseService.getAll().subscribe({
      next: data => {
        this.allHouses = data;
        this.places = this.allHouses.map(house => ({
          city: house.city,
          street: house.street,
          number: house.number
        }));

      },
      error: err => {
        console.error('Error fetching data:', err);
      }
    });

  }

}
