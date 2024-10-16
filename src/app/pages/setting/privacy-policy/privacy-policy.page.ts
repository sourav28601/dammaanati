import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/core/services/language/language.service';
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {
  dataLoaded = false;
  constructor(
    private languageService:LanguageService
  ) {
    this.languageService.initLanguage();
   }
  ionViewWillEnter() {
    this.loadData();
  }
  loadData() {
    // Fetch or prepare the data here
    this.dataLoaded = true;
  }

  ngOnInit() {
  }

}
