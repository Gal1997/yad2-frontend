import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import House from '../../models/house';
import Vehicle from '../../models/vehicle';
import Yad2 from '../../models/yad2';

// Reusable type for card items
type CardItem = House | Vehicle | Yad2;

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  private router = inject(Router)

  @Input() item!: CardItem;


  onCardClick(item: CardItem) {
    const type = this.getItemType();

    this.router.navigate(
      ['/details', item._id],
      { state: { item, type } }
    );
  }

  public isVehicle(item: CardItem): item is Vehicle {
    return 'baalut' in item && 'horsepower' in item;
  }
  public isHouse(item: CardItem): item is House {
    return 'street' in item && 'rooms' in item;
  }
  public isYad2(item: CardItem): item is Yad2 {
    return 'itemDescription' in item && 'itemCondition' in item;
  }

  getItemType() {
    if (this.isVehicle(this.item))
      return 'vehicle'
    if (this.isHouse(this.item))
      return 'house'
    if (this.isYad2(this.item))
      return 'yad2'
    return ""
  }


}
