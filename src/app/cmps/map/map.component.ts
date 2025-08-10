import { Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
    <div id="map" class="map-container" [class.map-blur]="isLoading"></div>
  `,
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnChanges {

  constructor(private http: HttpClient) { }
  isLoading: boolean = false;
  private map!: L.Map;
  private markersLayer = L.layerGroup();

  @Input() places: { city: string; street: string }[] = [];
  coordinates: { lat: number; lon: number }[] = [];
  BASE_URL = 'http://localhost:3000'

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [31.7, 35.03],
      zoom: 9,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 12,
      minZoom: 8
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['places'] && this.places.length > 0) {
      this.isLoading = true;
      this.coordinates = [];
      this.markersLayer.clearLayers();

      const requests = this.places.map(place =>
        this.http.get<any[]>(`${this.BASE_URL}/geocode`, {
          params: { address: `${place.street}, ${place.city}` }
        })
      );

      forkJoin(requests).subscribe({
        next: resultsArray => {
          resultsArray.forEach((results, index) => {
            if (results.length > 0) {
              const { lat, lon } = results[0];
              const coord = { lat: +lat, lon: +lon };
              this.coordinates.push(coord);

              const place = this.places[index];

              const marker = L.circleMarker([coord.lat, coord.lon], {
                radius: 6,
                color: 'white',
                weight: 2,
                fillColor: '#ff7300ff',
                fillOpacity: 1
              });

              marker
                .addTo(this.markersLayer)
                .bindPopup(`<div>${place.street}, ${place.city}</div>`)
                .on('mouseover', () => {
                  marker.openPopup();
                  marker.setRadius(8);
                })
                .on('mouseout', () => {
                  marker.closePopup();
                  marker.setRadius(6);
                });
            }
          });

          if (this.coordinates.length > 0) {
            const latLngs = this.coordinates.map(c => [c.lat, c.lon] as [number, number]);
            this.map.fitBounds(latLngs);
          }
          this.isLoading = false;
        },
        error: err => {
          console.error("Geocoding error:", err);
          this.isLoading = false;
        }
      });
    }
  }
}
