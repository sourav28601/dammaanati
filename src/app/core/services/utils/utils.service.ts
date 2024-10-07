import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Share } from '@capacitor/share';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  
  private isMenuEnabled = new Subject<boolean>();
  passwordValidator="/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/";
  constructor(private alertController: AlertController) { }

  setMenuState(enabled) {
    this.isMenuEnabled.next(enabled);
  }

  
  getMenuState(): Subject<boolean> {
    return this.isMenuEnabled;
  }
  async showConfirmation(options: {
    header: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: string;
    cancelColor?: string;
  }): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: options.header,
        message: options.message,
        buttons: [
          {
            text: options.cancelText || 'Cancel',
            role: 'cancel',
            cssClass: options.cancelColor || 'success-button',
            handler: () => {
              resolve(false);
            }
          },
          {
            text: options.confirmText || 'Confirm',
            cssClass: options.confirmColor || 'danger-button',
            handler: () => {
              resolve(true);
            }
          }
        ],
         mode: 'ios',
        cssClass: 'custom-alert'
      });
  
      await alert.present();
    });
  }
  async checkPermission(): Promise<boolean> {
    // return true;
    return new Promise(async (resolve) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScan(): Promise<string> {
    // return "ram";
    return new Promise(async (resolve) => {
      const allowed = await this.checkPermission();
      if (allowed) {
        await BarcodeScanner.hideBackground();
        document.querySelector('body').classList.add('scanner-active');
        const result = await BarcodeScanner.startScan();
        if (result.hasContent) {
          resolve(result.content);
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    }
  );
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
  }
}
