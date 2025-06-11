import { Component, Input } from '@angular/core';
import Card from '../../models/item'

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Input() item!: Card

}
