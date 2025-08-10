import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HouseService } from '../../services/house.service';
import House from '../../models/house';
import Vehicle from '../../models/vehicle';
import { VehicleService } from '../../services/vehicle.service';
import Yad2 from '../../models/yad2';

type CardItem = House | Vehicle | Yad2;
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  item!: CardItem;
  type!: 'house' | 'vehicle' | 'yad2' | '';
  showPhoneNumber = false;


  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private houseService = inject(HouseService);
  private vehicleService = inject(VehicleService);
  fallbackImage = 'https://workingat.vu.nl/static/images/placeholder-image.jpg';

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.fallbackImage;
  }


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.item = history.state.item;
    this.type = history.state.type;

    if (!this.item && id) {
      console.log('No item in state, fetching from backend...');

      // Try fetching from both services (sequentially)
      this.houseService.getById(id).subscribe({
        next: (house) => {
          if (house) {
            this.item = house;
            this.type = 'house';
          }
        },
        error: () => {
          this.vehicleService.getById(id).subscribe({
            next: (vehicle) => {
              if (vehicle) {
                this.item = vehicle;
                this.type = 'vehicle';
              }
            },
            error: () => {
              console.warn('Item not found in either service.');
              this.type = '';
            }
          });
        }
      });
    }
  }

  // item is House is for the html. without it doing ngIf(isHouse(item)) won't be possible
  // and as a result typescript will not know item is a house.
  isHouse(item: CardItem): item is House {
    return this.type === 'house';
  }

  isVehicle(item: CardItem): item is Vehicle {
    return this.type === 'vehicle';
  }

  isYad2(item: CardItem): item is Yad2 {
    return this.type === 'yad2';
  }

  formatTenDigits(input: string): string {
    return input.slice(0, 3) + '-' + input.slice(3, 6) + '-' + input.slice(6);
  }

  addCommas(numStr: string): string {
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
