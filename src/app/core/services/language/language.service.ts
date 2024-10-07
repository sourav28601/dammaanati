import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageSubject = new BehaviorSubject<string>('en');
  
  constructor(private translate: TranslateService) {
    this.initLanguage();
  }
  
  initLanguage() {
    const savedLang = localStorage.getItem('language') || 'en';
    this.setLanguage(savedLang);
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
    this.languageSubject.next(lang);
    this.updateDirection(lang); 
  }

  getCurrentLanguage() {
    return this.languageSubject.asObservable();
  }

  private updateDirection(language: string) {
    const direction = language === 'ar' ? 'rtl' : 'ltr';
    document.dir = direction;
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
  }

  instant(key: string | string[], interpolateParams?: Object) {
    return this.translate.instant(key, interpolateParams);
  }
}
