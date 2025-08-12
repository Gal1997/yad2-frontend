import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnChanges {

  constructor(private http: HttpClient) {
    this.loadCache();
    console.log('Cache loaded in constructor:', this.geocodeCache);
  }


  isLoading = false;
  private map!: L.Map;
  private markersLayer = L.layerGroup();

  @Input() places: { city: string; street: string, number: number }[] = [];
  coordinates: { lat: number; lon: number }[] = [];
  BASE_URL = environment.production ? '' : 'http://localhost:3000';


  // Persistent cache
  private geocodeCache = new Map<string, { lat: number; lon: number }>();

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [31.7, 35.03],
      zoom: 9,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 14,
      minZoom: 8
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['places'] && this.places.length > 0) {
      this.isLoading = true;
      this.coordinates = [];
      this.markersLayer.clearLayers();

      const requests = this.places.map(place => {
        const key = `${place.street} ${place.number}, ${place.city}`.trim();
        if (this.geocodeCache.has(key)) {


          // Use cached result
          return of([this.geocodeCache.get(key)]);
        }



        // Fetch from API
        return this.http.get<any[]>(`${this.BASE_URL}/geocode`, {
          params: { address: key }
        });
      });

      forkJoin(requests).subscribe({
        next: resultsArray => {
          resultsArray.forEach((results, index) => {
            if (results.length > 0) {
              const { lat, lon } = results[0];
              const coord = { lat: +lat, lon: +lon };

              const key = `${this.places[index].street} ${this.places[index].number}, ${this.places[index].city}`.trim();

              // Save to cache and persist
              this.geocodeCache.set(key, coord);
              this.saveCache();

              this.coordinates.push(coord);

              const marker = L.circleMarker([coord.lat, coord.lon], {
                radius: 6,
                color: 'white',
                weight: 2,
                fillColor: '#ff7300ff',
                fillOpacity: 1
              });

              marker
                .addTo(this.markersLayer)
                .bindPopup(`<div>${this.places[index].street} ${this.places[index].number}, ${this.places[index].city}</div>`)
                .on('mouseover', () => {
                  marker.openPopup();
                  marker.setRadius(8);
                })
                .on('mouseout', () => {
                  marker.closePopup();
                  marker.setRadius(6);
                })


            }
          });

          if (this.coordinates.length > 0 && this.map) {
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

  private loadCache() {
    const cacheData = localStorage.getItem('geocodeCache');
    if (cacheData) {
      try {
        const parsed = JSON.parse(cacheData);
        this.geocodeCache = new Map<string, { lat: number; lon: number }>(parsed);
        console.log("NAA", this.geocodeCache);

      } catch (e) {
        console.error('Failed to parse geocode cache', e);
      }
    }
  }

  private saveCache() {
    const arr = Array.from(this.geocodeCache.entries());
    localStorage.setItem('geocodeCache', JSON.stringify(arr));
  }
}
