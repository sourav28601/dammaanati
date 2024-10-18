import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
// import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { LoaderService } from 'src/app/core/services/loader/loader.service';
@Component({
  selector: 'app-add-shop-location',
  templateUrl: './add-shop-location.page.html',
  styleUrls: ['./add-shop-location.page.scss'],
})
export class AddShopLocationPage implements OnInit {
  @ViewChild('map', { static: true }) mapElementRef: ElementRef;
  map: any;
  marker: any; // Store the marker object
  currLatitude: number;
  currLongitude: number;
  googleMaps: any;
  address: string = 'Select a location';

  constructor(
    private ngZone: NgZone,
    private navCtrl: NavController,
    private languageService: LanguageService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.loadMap();
    this.languageService.initLanguage();
  }

  async loadMap() {
    try {
      await this.getCurrentPosition(); // Get current location
      await this.loadGoogleMaps(); // Load Google Maps SDK

      const mapEl = this.mapElementRef.nativeElement;

      // Initialize map
      this.map = new this.googleMaps.Map(mapEl, {
        center: { lat: this.currLatitude, lng: this.currLongitude },
        zoom: 15,
      });

      // Add a marker for current location
      this.marker = new this.googleMaps.Marker({
        position: { lat: this.currLatitude, lng: this.currLongitude },
        map: this.map,
        title: 'Current Location',
        draggable: true,
      });

      // Add map click listener to add/update marker
      this.googleMaps.event.addListener(this.map, 'click', (event) => {
        const clickedLat = event.latLng.lat();
        const clickedLng = event.latLng.lng();

        // Update marker position
        this.updateMarkerPosition(clickedLat, clickedLng);
        // Get and display address
        this.fetchAddress(clickedLat, clickedLng);
      });

      // Add marker dragend listener to get new position and update address
      this.googleMaps.event.addListener(this.marker, 'dragend', (event) => {
        const draggedLat = event.latLng.lat();
        const draggedLng = event.latLng.lng();

        this.fetchAddress(draggedLat, draggedLng);
      });

    } catch (e) {
      console.error('Error loading map', e);
    }
  }

  // Method to update marker's position
  updateMarkerPosition(lat: number, lng: number) {
    if (this.marker) {
      this.marker.setPosition({ lat, lng });
    } else {
      this.marker = new this.googleMaps.Marker({
        position: { lat, lng },
        map: this.map,
        draggable: true,
      });
    }
  }

  // Fetch address using reverse geocoding
  async fetchAddress(lat: number, lng: number) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.mapsKey}`
      );
      const data = await response.json();
      if (data.status === 'OK') {
        const address = data.results[0].formatted_address;
        this.ngZone.run(() => {
          this.address = address;
          console.log('Selected Address:', this.address);
        });
      } else {
        console.error('Error fetching address:', data.status);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  }

  // Get current location (Geolocation)
  async getCurrentPosition() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.currLatitude = position.coords.latitude;
      this.currLongitude = position.coords.longitude;
    } catch (error) {
      console.error('Error getting current position', error);
    }
  }

  // Load Google Maps SDK dynamically
  loadGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;

    if (googleModule && googleModule.maps) {
      this.googleMaps = googleModule.maps;
      return Promise.resolve(googleModule.maps);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.mapsKey}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          this.googleMaps = loadedGoogleModule.maps;
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Maps SDK not available.');
        }
      };

      script.onerror = () => {
        reject('Failed to load Google Maps SDK.');
      };
    });
  }

  // Navigate back and pass the selected address
  setLocation() {
    this.navCtrl.navigateBack('/add-product', {
      state: { address: this.address },
    });
    console.log('Setting location:', this.address);
  }
}

