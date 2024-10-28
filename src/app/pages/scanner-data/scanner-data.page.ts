import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-scanner-data',
  templateUrl: './scanner-data.page.html',
  styleUrls: ['./scanner-data.page.scss'],
})
export class ScannerDataPage implements OnInit {
  scannedData: string;
  isUrl: boolean = false;
  hasResult: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private iab: InAppBrowser
  ) {}

  ngOnInit() {
    const stateData = history.state.data;
    console.log('State data:', stateData);

    if (stateData) {
      this.scannedData = stateData;
      this.hasResult = true;
      // Check if the scanned data is a URL
      this.isUrl = this.isValidUrl(this.scannedData);
    } else {
      this.hasResult = false;
      this.scannedData = "No result found";
    }
  }

  isValidUrl(str: string): boolean {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  openUrl(url: string) {
    const browser = this.iab.create(url, '_blank', {
      location: 'yes',
      toolbarcolor: '#ffffff',
      navigationbuttoncolor: '#000000',
      closebuttoncolor: '#000000'
    });
  }

  navigateToHome() {
    this.router.navigate(['/apptabs/tabs/home']);
  }
}