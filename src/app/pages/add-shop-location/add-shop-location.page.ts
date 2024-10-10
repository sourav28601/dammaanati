import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';
import { LanguageService } from 'src/app/core/services/language/language.service';

@Component({
  selector: 'app-add-shop-location',
  templateUrl: './add-shop-location.page.html',
  styleUrls: ['./add-shop-location.page.scss'],
})
export class AddShopLocationPage implements OnInit {
  @ViewChild('map') mapRef!: ElementRef<HTMLElement>;
  newMap!: GoogleMap;
  center: any = {
    lat: 28.6468935,
    lng: 76.9531791,
  };
  markerId: string = ''; // To store the current marker's ID
  address: string = 'Select a location';

  constructor(
    private ngZone: NgZone,
    private navCtrl: NavController,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.languageService.initLanguage();
  }

  ngAfterViewInit() {
    this.createMap();
  }

  async createMap() {
    try {
      // Initialize the map
      this.newMap = await GoogleMap.create({
        id: 'capacitor-google-maps',
        element: this.mapRef.nativeElement,
        apiKey: environment.mapsKey,
        config: {
          center: this.center,
          zoom: 13,
        },
      });

      // Set the initial camera position
      await this.newMap.setCamera({
        coordinate: {
          lat: this.center.lat,
          lng: this.center.lng,
        },
      });

      // Enable traffic layer
      await this.newMap.enableTrafficLayer(true);

      // Add marker at the center
      await this.addMarker(this.center.lat, this.center.lng); // Add initial marker
      await this.addListeners();
    } catch (e) {
      console.error(e);
    }
  }

  async addMarker(lat: number, lng: number) {
    try {
      // Remove the previous marker if it exists
      if (this.markerId) {
        await this.removeMarker(); // Remove any existing marker
      }

      // Add the new marker
      this.markerId = await this.newMap.addMarker({
        coordinate: { lat, lng },
        draggable: true,
      });
      console.log('New marker added at:', lat, lng);
    } catch (e) {
      console.error('Error adding marker:', e);
    }
  }

  async removeMarker() {
    try {
      if (this.markerId) {
        await this.newMap.removeMarker(this.markerId); // Remove the marker using its ID
        console.log('Previous marker removed');
        this.markerId = ''; // Clear marker ID after removing
      }
    } catch (e) {
      console.error('Error removing marker:', e);
    }
  }

  async addListeners() {
    // Marker click listener
    this.newMap.setOnMarkerClickListener(async (event) => {
      console.log('Marker clicked at:', event.latitude, event.longitude);
      const address = await this.getAddress(event.latitude, event.longitude);
      this.ngZone.run(() => {
        this.address = address;
        console.log('Address:', this.address);
      });
    });

    // Map click listener - Adds a new marker and removes the old one
    this.newMap.setOnMapClickListener(async (event) => {
      console.log('Map clicked at:', event.latitude, event.longitude);
      await this.addMarker(event.latitude, event.longitude); // Automatically removes the previous marker
      const address = await this.getAddress(event.latitude, event.longitude);
      this.ngZone.run(() => {
        this.address = address;
        console.log('Address:', this.address);
      });
    });

    // Marker drag end listener
    this.newMap.setOnMarkerDragEndListener(async (event) => {
      console.log('Marker dragged to:', event.latitude, event.longitude);
      const address = await this.getAddress(event.latitude, event.longitude);
      this.ngZone.run(() => {
        this.address = address;
        console.log('Address:', this.address);
      });
    });

    // Location button click listener
    this.newMap.setOnMyLocationButtonClickListener(async () => {
      const location = await this.getCurrentLocation();
      if (location) {
        await this.newMap.setCamera({
          coordinate: {
            lat: location.latitude,
            lng: location.longitude,
          },
          zoom: 15,
        });
        await this.addMarker(location.latitude, location.longitude); // Adds marker at current location
        const address = await this.getAddress(location.latitude, location.longitude);
        console.log('My location address:', address);
      }
    });
  }

  async getAddress(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.mapsKey}`
      );
      const data = await response.json();
      if (data.status === 'OK') {
        const result = data.results[0];
        return result.formatted_address;
      } else {
        console.error('Geocoding error:', data.status);
        return 'Address not found';
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Error retrieving address';
    }
  }

  async getCurrentLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  setLocation() {
    this.navCtrl.navigateBack('/add-product', {
      state: { address: this.address },
    });
    console.log('Setting location:', this.address);
  }
}
