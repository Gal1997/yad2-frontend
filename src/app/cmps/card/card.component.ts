import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import House from '../../models/house';


@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  private router = inject(Router)
  @Input() item!: House;



  onCardClick(house: House) {
    this.router.navigate(
      ['/details', house._id],
      { state: { house } }
    );

  }
}
