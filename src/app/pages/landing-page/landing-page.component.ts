import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { CardComponent } from "../../cmps/card/card.component";
import Card from "../../models/item"


@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, CarouselModule, CardComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  standalone: true
})
export class LandingPageComponent implements OnInit {
  products: Card[] = [];

  ngOnInit() {
    this.products = [
      { image: 'https://img.yad2.co.il/Pic/202411/13/2_5/o/y2_1_HqTe4uUwCp_20241113.png?c=3&w=309&h=150', price: "2,750,000 ₪", info1: "משהו", info2: "משהו2" },
      { image: 'https://img.yad2.co.il/Pic/202411/13/2_5/o/y2_1_HqTe4uUwCp_20241113.png?c=3&w=309&h=150', price: "3,750,000 ₪", info1: "משהו", info2: "משהו2" },
      { image: 'https://img.yad2.co.il/Pic/202505/25/2_2/o/y2_1_09548_20250525202955.jpeg?c=3&w=309&h=150', price: "4,750,000 ₪", info1: "משהו", info2: "משהו2" },
      { image: 'https://img.yad2.co.il/Pic/202411/13/2_5/o/y2_1_HqTe4uUwCp_20241113.png?c=3&w=309&h=150', price: "5,750,000 ₪", info1: "משהו", info2: "משהו2" },
      { image: 'https://img.yad2.co.il/Pic/202505/11/2_6/o/y2_1pa_010156_20250511223853.jpeg?c=3&w=309&h=150', price: "6,750,000 ₪", info1: "משהו", info2: "משהו2" },
      { image: 'https://img.yad2.co.il/Pic/202503/11/2_5/o/y2_2_HH_0J2mpML_20250311.jpg?c=3&w=309&h=150', price: "7,750,000 ₪", info1: "משהו", info2: "משהו2" },
      { image: 'https://img.yad2.co.il/Pic/202505/25/2_2/o/y2_1_09548_20250525202955.jpeg?c=3&w=309&h=150', price: "8,750,000 ₪", info1: "משהו", info2: "משהו2" },
      { image: 'https://img.yad2.co.il/Pic/202506/09/2_6/o/y2_1pa_010512_20250609182654.jpeg?c=3&w=309&h=150', price: "9,750,000 ₪", info1: "משהו", info2: "משהו2" }
    ];
  }


}
