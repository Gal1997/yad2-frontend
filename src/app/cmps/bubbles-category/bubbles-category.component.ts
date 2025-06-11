import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';

interface Product {
  name: string;
  image: string;
}


@Component({
  selector: 'app-bubbles-category',
  imports: [CommonModule, CarouselModule],
  standalone: true,
  templateUrl: './bubbles-category.component.html',
  styleUrl: './bubbles-category.component.scss'
})

export class BubblesCategoryComponent implements OnInit {
  products: Product[] = [];

  ngOnInit() {
    this.products = [
      { name: 'Apple', image: 'https://placehold.co/300x200' },
      { name: 'Banana', image: 'https://placehold.co/300x200' },
      { name: 'Cherry', image: 'https://placehold.co/300x200' },
      { name: 'Date', image: 'https://placehold.co/400x200' },
      { name: 'Fig', image: 'https://placehold.co/300x200' }
    ];
  }


}
