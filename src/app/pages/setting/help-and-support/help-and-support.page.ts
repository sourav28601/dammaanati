import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { LoaderService } from 'src/app/core/services/loader/loader.service';
@Component({
  selector: 'app-help-and-support',
  templateUrl: './help-and-support.page.html',
  styleUrls: ['./help-and-support.page.scss'],
})
export class HelpAndSupportPage implements OnInit {
  faqs: any;
  email:string = "support@gmail.com";
  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private languageService:LanguageService ,
    private loader:LoaderService,
  )  { }

  ngOnInit() {
    this.allFaq();
  }
  
  allFaq() {
    this.loader.showLoading();
    this.apiService.getAllFaq().subscribe({
      next: (response: any) => { 
        this.loader.hideLoading();
        this.faqs = response.data;
        console.log("this.faqs------",this.faqs);
      },
      error: (error) => {
        this.loader.hideLoading();
        console.error('Error loading categories:', error);
      },
    });
  }

}
