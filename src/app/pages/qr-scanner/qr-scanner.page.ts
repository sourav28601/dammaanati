import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/core/services/utils/utils.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit {
  scannedResult: string;
  isScannerActive = false;
  

  constructor(private utilService:UtilService, private router: Router, private activeroute:ActivatedRoute) {
   
   }
   

  ngOnInit() {
    this.activeroute.url.subscribe((url) => {
      this.startScan();
    });
  }
  async checkPermission(): Promise<boolean> {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        return true;
      }
      return false;
    } catch(e) {
      console.log(e);
      return false; 
    }
  }
  async startScan() {
    try {
      const permission = await this.checkPermission();
      if (!permission) {
        return;
      }
      await BarcodeScanner.hideBackground();
      // document.body.classList.add('scanner-active');
      this.utilService.setScannerActive(true);
      const result = await BarcodeScanner.startScan();
      console.log(result);
      if (result?.hasContent) {
        this.scannedResult = result.content;
        this.router.navigate(['/scanner-data'], { state: { data: this.scannedResult } });
        console.log(this.scannedResult);
      }
    } catch(e) {
      console.log(e);
    } finally {
      this.stopScan();
    }
  }
  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    // document.body.classList.remove('scanner-active');
    this.utilService.setScannerActive(false);
    // this.router.navigate(['/apptabs/tabs/home']);
  }

  stop() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    // document.body.classList.remove('scanner-active');
    this.utilService.setScannerActive(false);
    this.router.navigate(['/apptabs/tabs/home']);
  }
}
