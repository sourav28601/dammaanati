import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { UtilService } from 'src/app/core/services/utils/utils.service';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  constructor(
    private router: Router,
    private utilService: UtilService,
    private languageService: LanguageService
  ) {
    this.languageService.initLanguage();
  }

  ngOnInit() {}

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
}
