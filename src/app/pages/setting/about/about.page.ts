import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/core/services/language/language.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(private languageService:LanguageService) { 
    this.languageService.initLanguage();
  }

  ngOnInit() {
  }

}
