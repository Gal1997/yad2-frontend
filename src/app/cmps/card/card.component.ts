import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import House from '../../models/house';
import Vehicle from '../../models/vehicle';


@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  private router = inject(Router)
  @Input() item!: House | Vehicle;


  onCardClick(item: House | Vehicle) {
    const type = this.getItemType();

    this.router.navigate(
      ['/details', item._id],
      { state: { item, type } }
    );
  }

  public isVehicle(item: House | Vehicle): item is Vehicle {
    return 'baalut' in item && 'horsepower' in item;
  }
  public isHouse(item: House | Vehicle): item is House {
    return 'street' in item && 'rooms' in item;
  }

  getItemType() {
    if (this.isVehicle(this.item))
      return 'vehicle'
    if (this.isHouse(this.item))
      return 'house'
    return ""
  }
}
