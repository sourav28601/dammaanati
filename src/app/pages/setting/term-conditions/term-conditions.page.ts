import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/core/services/language/language.service';
@Component({
  selector: 'app-term-conditions',
  templateUrl: './term-conditions.page.html',
  styleUrls: ['./term-conditions.page.scss'],
})
export class TermConditionsPage implements OnInit {

  constructor( private languageService:LanguageService) { 
    this.languageService.initLanguage();
  }

  ngOnInit() {
  }

}
