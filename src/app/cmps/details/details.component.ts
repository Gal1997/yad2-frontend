import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HouseService } from '../../services/house.service';
import House from '../../models/house';
import Vehicle from '../../models/vehicle';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-house-details',
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  house!: House;
  vehicle!: Vehicle;
  type!: string;
  showPhoneNumber: boolean = false;
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute)
  private houseService = inject(HouseService)
  private vehicleService = inject(VehicleService)



  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.type = history.state.type;

    if (this.type === 'vehicle')
      this.vehicle = history.state.item
    else if (this.type === 'house')
      this.house = history.state.item


    console.log(this.type);


    if (!this.house && !this.vehicle && id) {
      // Cool: only fetch if can't get data from route (like if user came from link and not from clicking a house)
      // Instead of always fetching from backend
      console.log("No item in state, fetching from backend...");

      if (this.type === 'house')
        this.houseService.getById(id!).subscribe((house: House) => {
          this.house = house;
        });
      else if (this.type === 'vehicle')
        this.vehicleService.getById(id!).subscribe((vehicle: Vehicle) => {
          this.vehicle = vehicle;
        });

    }
  }


  formatTenDigits(input: string): string {
    if (!/^\d{10}$/.test(input)) return input;
    return input.slice(0, 3) + '-' + input.slice(3, 7) + '-' + input.slice(7);
  }





}
