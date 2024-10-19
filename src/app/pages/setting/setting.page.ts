import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Share } from '@capacitor/share';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { UtilService } from 'src/app/core/services/utils/utils.service';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';
import { isPlatform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
   
  darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();
  mode:any
  constructor(
    private router: Router,
    private utilService: UtilService,
    @Inject(PLATFORM_ID) private platformId: object,
    private languageService: LanguageService,
    private activatedRoute: ActivatedRoute
  ) {
    this.languageService.initLanguage();
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe(() => {
      this.initializeTheme();
    //  this.utilService.initializeTheme();
     this.mode=localStorage.getItem('mode');
     if(this.mode==='true'){
      this.darkMode.next(true);
     }else{
      this.darkMode.next(false);
     }
    
    });
  }

  async initializeTheme() {
   
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
 
    const storedTheme = await Preferences.get({ key: 'darkModeActivated' });
    // alert(storedTheme)
   
    if (storedTheme && storedTheme.value !== null) {
    
      this.setTheme(storedTheme.value === 'true');
    } else {
      if(this.mode==='true'){
        this.setTheme(true);
        this.darkMode.next(true);
       }else if(this.mode==='false'){
        this.setTheme(false);
        this.darkMode.next(false);
       }
       else{
        this.setTheme(true);
        this.darkMode.next(true);
       }
      }
      const prefers = window.matchMedia('(prefers-color-scheme: dark)');

      prefersDark.addEventListener('change', (mediaQuery) => {
        const systemMode = mediaQuery.matches ? 'dark' : 'light';
        if(systemMode==='dark'){
          this.setTheme(true);  
        }else{
          this.setTheme(false); 
        }
        console.log('System mode:', systemMode);
       
      });
      
      // Initial check
      const initialSystemMode = prefersDark.matches ? 'dark' : 'light';
      console.log('Initial system mode:', initialSystemMode);
  }

  async setTheme(dark: boolean) {
    this.darkMode.next(dark);

    document.body.classList.toggle('dark', dark);
         
    if (isPlatform('capacitor')) {
      await Preferences.set({ key: 'darkModeActivated', value: dark ? 'true' : 'false' });
      await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
    }
  
    // Set localStorage based on the dark mode state
    localStorage.setItem('mode', dark ? 'true' : 'false');
  }

  async toggleDarkMode() {
    const isDark = !this.darkMode.value;
    this.utilService.setTheme(isDark);
    
  }

  async referApp() {
    const data = {
      title: 'Dammanti - Your Warranty Management App',
      text: 'I\'ve been using Dammanti to manage all my product warranties and it\'s been a game-changer! Never miss a warranty claim again. It\'s easy to use, sends timely reminders, and keeps all your warranty information in one place. Give it a try!',
      url: 'https://dammanti.com',
      dialogTitle: 'Share Dammanti with friends',
    };
    try {
      await Share.share(data);
      console.log('Successfully shared');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  // async signOut() {
  //   const shouldSignOut = await this.utilService.showConfirmation({
  //     header: this.languageService.instant('SIGN_OUT'),
  //     message: this.languageService.instant('SIGN_OUT_CONFIRMATION'),
  //     confirmText: this.languageService.instant('SIGN_OUT'),
  //     cancelText: this.languageService.instant('CANCEL'),
  //   });
  //   if (shouldSignOut) {
  //     await Preferences.remove({ key: 'user_data' });
  //     setTimeout(() => {
  //       this.router.navigate(['/login']);
  //       Preferences.clear();
  //     }, 500);
  //   }
  // }
  async signOut() {
    const shouldSignOut = await this.utilService.showConfirmation({
      header: this.languageService.instant('SIGN_OUT'),
      message: this.languageService.instant('SIGN_OUT_CONFIRMATION'),
      confirmText: this.languageService.instant('SIGN_OUT'),
      cancelText: this.languageService.instant('STAY'),
    });
     if (shouldSignOut) {
      localStorage.removeItem('user_data')
      setTimeout(() => {
        this.router.navigate(['/login'])
      }, 500)
     }
   }
}