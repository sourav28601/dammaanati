import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { LanguageService } from 'src/app/core/services/language/language.service';
@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.page.html',
  styleUrls: ['./feedbacks.page.scss'],
})
export class FeedbacksPage implements OnInit {
  feedbackForm: FormGroup;
  userData: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService,
    private languageService:LanguageService
  ) {
    this.languageService.initLanguage();
  }

  ngOnInit() {
    this.initForm();
    this.getUserData();
  }

  initForm() {
    this.feedbackForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      feedback_text: ['', Validators.required],
    });
  }

  getUserData() {
    this.apiService.getUserData().subscribe({
      next: (response: any) => {
        console.log('this.userData==>', response);
        this.userData = response?.data;
        this.feedbackForm.patchValue({ email: 'support@dammanati.com' });
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      },
    });
  }

  onSubmit() {
    if (this.feedbackForm.valid) {
      const data = this.feedbackForm.value;
      this.apiService.sendFeedBack(data).subscribe({
        next: (response) => {
          this.messageService.presentToast('Feedback Sent Successfully', 'success');
          this.feedbackForm.reset();
        },
        error: (error) => {
          this.messageService.presentToast('Feedback failed to send', 'danger');
        }
      });
    }
  }
}