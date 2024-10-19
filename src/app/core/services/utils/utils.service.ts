// import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
// import { Subject } from 'rxjs';
// import { Share } from '@capacitor/share';
// import { AlertController } from '@ionic/angular';
// import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
// import { BehaviorSubject } from 'rxjs';
// import { Preferences } from '@capacitor/preferences';
// import { isPlatform } from '@ionic/angular';
// import { StatusBar, Style } from '@capacitor/status-bar';

// @Injectable({
//   providedIn: 'root'
// })
// export class UtilService {
//   contentVisibility: string = '';
//   private isMenuEnabled = new Subject<boolean>();
//   passwordValidator="/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/";
//   private contentVisibilitySubject = new BehaviorSubject<string>('');
//   contentVisibility$ = this.contentVisibilitySubject.asObservable();

//   darkMode = new BehaviorSubject<boolean>(false);
//   mode:any
//   constructor(private alertController: AlertController, @Inject(PLATFORM_ID) private platformId: object) { 
//       this.initializeTheme();
//      this.mode=localStorage.getItem('mode');
//      if(this.mode==='true'){
//       this.darkMode.next(true);
//      }else{
//       this.darkMode.next(false);
//      }
//   }
 

//   async initializeTheme() {
//      const prefers = window.matchMedia('(prefers-color-scheme: dark)');
//      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
//       prefersDark.addEventListener('change', (mediaQuery) => {
//         const systemMode = mediaQuery.matches ? 'dark' : 'light';
//         if(systemMode==='dark'){
//           this.setTheme(true);  
//         }else{
//           this.setTheme(false); 
//         }
//         console.log('System mode:', systemMode);
       
//       });
   
//     const storedTheme = await Preferences.get({ key: 'darkModeActivated' });
//     if (storedTheme && storedTheme.value !== null) {
    
//       this.setTheme(storedTheme.value === 'true');
//     } else {
//       if(this.mode==='true'){
//         this.setTheme(true);
//         this.darkMode.next(true);
//        }else if(this.mode==='false'){
//         this.setTheme(false);
//         this.darkMode.next(false);
//        }
       
//       }
    
      
//       // Initial check
//       const initialSystemMode = prefersDark.matches ? 'dark' : 'light';
//       console.log('Initial system mode:', initialSystemMode);
//   }

//   async setTheme(dark: boolean) {
//     this.darkMode.next(dark);

//     document.body.classList.toggle('dark', dark);
         
//     if (isPlatform('capacitor')) {
//       await Preferences.set({ key: 'darkModeActivated', value: dark ? 'true' : 'false' });
//       await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
//     }
  
//     // Set localStorage based on the dark mode state
//     localStorage.setItem('mode', dark ? 'true' : 'false');
//   }

//   setVisibility(state: string) {
//     this.contentVisibilitySubject.next(state);
//   }
//   private isScannerActiveSubject = new BehaviorSubject<boolean>(false);
//   isScannerActive$ = this.isScannerActiveSubject.asObservable();9

//   setScannerActive(isActive: boolean) {
//     this.isScannerActiveSubject.next(isActive);
//     if (isActive) {
//       document.body.classList.add('scanner-active');
//     } else {
//       document.body.classList.remove('scanner-active');
//     }
//   }
//   setMenuState(enabled) {
//     this.isMenuEnabled.next(enabled);
//   }

//   getMenuState(): Subject<boolean> {
//     return this.isMenuEnabled;
//   }
//   async showConfirmation(options: {
//     header: string;
//     message: string;
//     confirmText?: string;
//     cancelText?: string;
//     confirmColor?: string;
//     cancelColor?: string;
//   }): Promise<boolean> {
//     return new Promise(async (resolve) => {
//       const alert = await this.alertController.create({
//         header: options.header,
//         message: options.message,
//         buttons: [
//           {
//             text: options.cancelText || 'Cancel',
//             role: 'cancel',
//             cssClass: options.cancelColor || 'success-button',
//             handler: () => {
//               resolve(false);
//             }
//           },
//           {
//             text: options.confirmText || 'Confirm',
//             cssClass: options.confirmColor || 'danger-button',
//             handler: () => {
//               resolve(true);
//             }
//           }
//         ],
//          mode: 'ios',
//         cssClass: 'custom-alert'
//       });
  
//       await alert.present();
//     });
//   }
//   async checkPermission(): Promise<boolean> {
//     console.log('Checking permission...');
//     try {
//       const status = await BarcodeScanner.checkPermission({ force: true });
//       console.log('Permission status:', status);
//       if (status.granted) {
//         return true;
//       } else if (status.denied) {
//         console.log('Permission denied, opening app settings...');
//         BarcodeScanner.openAppSettings();
//         return false;
//       } else {
//         // Handle 'neverAsked' or any other status
//         console.log('Permission status is neither granted nor denied:', status);
//         return false;
//       }
//     } catch (error) {
//       console.error('Error checking permission:', error);
//       return false;
//     }
//   }
  
//   async startScan(): Promise<string> {
//     console.log('Starting scan in UtilService...');
//     try {
//       const allowed = await this.checkPermission();
//       if (allowed) {
//         console.log('Permission granted, preparing scanner...');
        
//         // Ensure full-screen scanner
//         await BarcodeScanner.hideBackground();
//         document.querySelector('body').classList.add('scanner-active');
        
//         // Start the scanner
//         const result = await BarcodeScanner.startScan();
//         console.log('Scan result:', result);
//         if (result.hasContent) {
//           return result.content;
//         } else {
//           console.log('No content in scan result');
//           return null;
//         }
//       } else {
//         console.log('Permission not allowed');
//         return null;
//       }
//     } catch (error) {
//       console.error('Error in startScan:', error);
//       return null;
//     }
//   }
  
//   stopScan() {
//     console.log('Stopping scan...');
//     BarcodeScanner.showBackground();
//     BarcodeScanner.stopScan();
//     document.querySelector('body').classList.remove('scanner-active');
//   }
  
// }
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Preferences } from '@capacitor/preferences';
import { isPlatform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  contentVisibility: string = '';
  private isMenuEnabled = new Subject<boolean>();
  passwordValidator = "/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/";
  private contentVisibilitySubject = new BehaviorSubject<string>('');
  contentVisibility$ = this.contentVisibilitySubject.asObservable();

  darkMode = new BehaviorSubject<boolean>(false);
  private prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  constructor(
    private alertController: AlertController,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.initializeTheme();
  }

  async initializeTheme() {
    // Check stored preference
    const storedTheme = await Preferences.get({ key: 'darkModeActivated' });
    
    if (storedTheme && storedTheme.value !== null) {
      // If there's a stored preference, use it
      this.setTheme(storedTheme.value === 'true');
    } else {
      // If no stored preference, use system preference
      this.setTheme(this.prefersDark.matches);
    }

    // Listen for changes in system preference
    this.prefersDark.addEventListener('change', (mediaQuery) => {
      const systemDark = mediaQuery.matches;
      console.log('System dark mode changed:', systemDark);
      this.setTheme(systemDark);
    });

    console.log('Initial dark mode:', this.darkMode.value);
  }

  async setTheme(dark: boolean) {
    this.darkMode.next(dark);
    document.body.classList.toggle('dark', dark);
         
    if (isPlatform('capacitor')) {
      await Preferences.set({ key: 'darkModeActivated', value: dark.toString() });
      await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
    }
  
    localStorage.setItem('mode', dark.toString());
    console.log('Theme set to:', dark ? 'dark' : 'light');
  }

  setVisibility(state: string) {
    this.contentVisibilitySubject.next(state);
  }

  private isScannerActiveSubject = new BehaviorSubject<boolean>(false);
  isScannerActive$ = this.isScannerActiveSubject.asObservable();

  setScannerActive(isActive: boolean) {
    this.isScannerActiveSubject.next(isActive);
    document.body.classList.toggle('scanner-active', isActive);
  }

  setMenuState(enabled: boolean) {
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
            handler: () => resolve(false)
          },
          {
            text: options.confirmText || 'Confirm',
            cssClass: options.confirmColor || 'danger-button',
            handler: () => resolve(true)
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
        console.log('Permission status is neither granted nor denied:', status);
        return false;
      }
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }
  
  async startScan(): Promise<string | null> {
    console.log('Starting scan in UtilService...');
    try {
      const allowed = await this.checkPermission();
      if (allowed) {
        console.log('Permission granted, preparing scanner...');
        await BarcodeScanner.hideBackground();
        document.body.classList.add('scanner-active');
        
        const result = await BarcodeScanner.startScan();
        console.log('Scan result:', result);
        return result.hasContent ? result.content : null;
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
    document.body.classList.remove('scanner-active');
  }
}

