import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
declare var window: any;
import { Keyboard } from '@capacitor/keyboard';
import { Location } from "@angular/common";
import { FcmService } from './core/services/fcm/fcm.service';
import { LanguageService } from './core/services/language/language.service';
import { UtilService } from './core/services/utils/utils.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
isScannerActive$:any;
 
  constructor(private location: Location,private fcm:FcmService, private router: Router, public platform: Platform,private languageService: LanguageService,private utilsService:UtilService) {
    this.utilsService.initializeTheme();
    this.isScannerActive$ = this.utilsService.isScannerActive$;
    this.utilsService.isScannerActive$.subscribe(isActive => {
      if (isActive) {
        document.body.classList.add('scanner-active');
      } else {
        document.body.classList.remove('scanner-active');
      }
    });
  this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler back button was called!');
      this.location.back();
        if (this.router.url == '/apptabs/tabs/home' || this.router.url == '/welcome-screen') {
        (navigator as any).app.exitApp();
      } else {

      }
    })
    this.platform.ready().then(() => {
      this.fcm.initPush();
      this.languageService.initLanguage();
      console.log('hello brother',this.fcm)
   }).catch(e => {
      console.log('error fcm: ', e);
   });
    Keyboard.addListener('keyboardWillShow', info => {
      console.log('keyboard will show with height:', info.keyboardHeight);
    });
    
    Keyboard.addListener('keyboardDidShow', info => {
      console.log('keyboard did show with height:', info.keyboardHeight);
    });
    
    Keyboard.addListener('keyboardWillHide', () => {
      console.log('keyboard will hide');
    });
    
    Keyboard.addListener('keyboardDidHide', () => {
      console.log('keyboard did hide');
    });
    
  }
}
