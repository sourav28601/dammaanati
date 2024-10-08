import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
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
  markerId: string = '';
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
      this.addMarker(this.center.lat, this.center.lng);
      this.addListeners();
    } catch (e) {
      console.error(e);
    }
  }

  async addMarker(lat: number, lng: number) {
    try {
      this.markerId = await this.newMap.addMarker({
        coordinate: { lat, lng },
        draggable: true,
      });
    } catch (e) {
      console.error('Error adding marker:', e);
    }
  }

  async removeMarker() {
    try {
      if (this.markerId) {
        await this.newMap.removeMarker(this.markerId);
        this.markerId = '';
      }
    } catch (e) {
      console.error('Error removing marker:', e);
    }
  }

  async addListeners() {
    // Marker click listener
    this.newMap.setOnMarkerClickListener((event) => {
      console.log('Marker clicked at:', event.latitude, event.longitude);
      this.ngZone.run(() => {
        this.address = `Marker at lat: ${event.latitude}, lng: ${event.longitude}`;
      });
    });

    // Map click listener - Adds a new marker
    this.newMap.setOnMapClickListener(async (event) => {
      console.log('Map clicked at:', event.latitude, event.longitude);
      await this.addMarker(event.latitude, event.longitude);
      this.ngZone.run(() => {
        this.address = `New marker at lat: ${event.latitude}, lng: ${event.longitude}`;
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
        await this.addMarker(location.latitude, location.longitude);
        console.log('My location:', location.latitude, location.longitude);
      }
    });

    // Marker drag end listener
    this.newMap.setOnMarkerDragEndListener((event) => {
      console.log('Marker dragged to:', event.latitude, event.longitude);
      this.ngZone.run(() => {
        this.address = `Marker dragged to lat: ${event.latitude}, lng: ${event.longitude}`;
      });
    });
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
