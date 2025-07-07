import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { House, HouseService } from '../../services/house.service';

@Component({
  selector: 'app-house-details',
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  house!: House;
  showPhoneNumber: boolean = false;
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute)
  private houseService = inject(HouseService)



  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.house = history.state.house;
    if (!this.house && id) {
      // Cool: only fetch if can't get data from route (like if user came from link and not from clicking a house)
      // Instead of always fetching from backend
      console.log("No house in state, fetching from backend...");
      this.houseService.getById(id!).subscribe((house: House) => {
        this.house = house;
      });

    }
  }


}
