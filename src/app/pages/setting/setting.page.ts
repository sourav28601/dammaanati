import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { UtilService } from 'src/app/core/services/utils/utils.service';
import { Preferences } from '@capacitor/preferences';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  darkMode: boolean = false;

  constructor(
    private router: Router,
    private utilService: UtilService,
    private languageService: LanguageService
  ) {
    this.languageService.initLanguage();
  }

  ngOnInit() {
    this.checkAppMode();
  }

  async referApp() {
    const data = {
      title: 'Dammanti - Your Warranty Management App',
      text: 'I,ve been using Dammanti to manage all my product warranties and its been a game-changer! Never miss a warranty claim again. Its easy to use, sends timely reminders, and keeps all your warranty information in one place. Give it a try!',
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

  async signOut() {
    const shouldSignOut = await this.utilService.showConfirmation({
      header: this.languageService.instant('SIGN_OUT'),
      message: this.languageService.instant('SIGN_OUT_CONFIRMATION'),
      confirmText: this.languageService.instant('SIGN_OUT'),
      cancelText: this.languageService.instant('CANCEL'),
    });
    if (shouldSignOut) {
      localStorage.removeItem('user_data');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 500);
    }
  }
  async checkAppMode() {
    // const checkIsDarkMode = localStorage.getItem('darkModeActivated');
    const checkIsDarkMode = await Preferences.get({key: 'darkModeActivated'});
    console.log(checkIsDarkMode);
      // checkIsDarkMode == 'true'
    checkIsDarkMode?.value == 'true'
      ? (this.darkMode = true)
      : (this.darkMode = false);
    document.body.classList.toggle('dark', this.darkMode);
  }

  toggleDarkMode() {
    this.darkMode= !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    if(this.darkMode) {
      Preferences.set({key: 'darkModeActivated', value: 'true'}); 
      // localStorage.setItem('darkModeActivated', 'true');
    } else {
      // localStorage.setItem('darkModeActivated', 'false');
      Preferences.set({key: 'darkModeActivated', value: 'false'});
    }
  }
}
