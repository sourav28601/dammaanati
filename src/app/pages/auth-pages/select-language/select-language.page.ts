import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { UtilService } from 'src/app/core/services/utils/utils.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.page.html',
  styleUrls: ['./select-language.page.scss'],
})
export class SelectLanguagePage implements OnInit {
  currentLanguage:any;
  constructor(private languageService:LanguageService,private utilService:UtilService,private activatedRoute:ActivatedRoute) { 
   
  }

  ngOnInit() {
    
    this.activatedRoute.url.subscribe(() => {
      this.utilService.initializeTheme();
     });
    this.currentLanguage = localStorage.getItem('language') || 'en';
   
  }
  switchLanguage(lang: string) {
    this.currentLanguage = lang;
    console.log("lang",lang);
    this.languageService.setLanguage(lang);
  }
}
