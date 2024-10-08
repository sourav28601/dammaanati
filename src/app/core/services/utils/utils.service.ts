import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Share } from '@capacitor/share';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  contentVisibility: string = '';
  private isMenuEnabled = new Subject<boolean>();
  passwordValidator="/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/";
  constructor(private alertController: AlertController) { }
  private contentVisibilitySubject = new BehaviorSubject<string>('');
  contentVisibility$ = this.contentVisibilitySubject.asObservable();

  setVisibility(state: string) {
    this.contentVisibilitySubject.next(state);
  }
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
    console.log('Checking permission...');
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      console.log('Permission status:', status);
      if (status.granted) {
        return true;
      } else if (status.denied) {
        console.log('Permission denied, opening app settings...');
        BarcodeScanner.openAppSettings();
        return false;
      } else {
        // Handle 'neverAsked' or any other status
        console.log('Permission status is neither granted nor denied:', status);
        return false;
      }
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }
  
  async startScan(): Promise<string> {
    console.log('Starting scan in UtilService...');
    try {
      const allowed = await this.checkPermission();
      if (allowed) {
        console.log('Permission granted, preparing scanner...');
        
        // Ensure full-screen scanner
        await BarcodeScanner.hideBackground();
        document.querySelector('body').classList.add('scanner-active');
        
        // Start the scanner
        const result = await BarcodeScanner.startScan();
        console.log('Scan result:', result);
        if (result.hasContent) {
          return result.content;
        } else {
          console.log('No content in scan result');
          return null;
        }
      } else {
        console.log('Permission not allowed');
        return null;
      }
    } catch (error) {
      console.error('Error in startScan:', error);
      return null;
    }
  }
  
  stopScan() {
    console.log('Stopping scan...');
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
  }
  
}
