import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-scanner-data',
  templateUrl: './scanner-data.page.html',
  styleUrls: ['./scanner-data.page.scss'],
})
export class ScannerDataPage implements OnInit {

  scannedData: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Accessing the navigation state data
    const stateData = history.state.data; // Get state from the history object
    console.log('State data:', stateData);

    if (stateData) {
      this.scannedData = stateData;
    } else {
      console.log("No scanned data found");
    }
  }
  navigateToHome(){
    this.router.navigate(['/apptabs/tabs/home']);
  }
}
