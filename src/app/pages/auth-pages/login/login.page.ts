import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { LoaderService } from 'src/app/core/services/loader/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isTypePassword = true;
  fcmToken: string;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  isSubmitted = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private languageService: LanguageService,
    private loader: LoaderService
  ) {
    this.languageService.initLanguage();
    this.initForm();
  }

  ngOnInit() {
    this.fcmToken = localStorage.getItem('fcm_token') || '';
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      this.loader.showLoading();
      const formData = { ...this.loginForm.value, fcm_token: this.fcmToken };
      this.apiService.login(formData).subscribe({
        next: (response: any) => {
          this.loader.hideLoading();
          this.messageService.presentToast(response.message || 'Login Successful', 'success');
          localStorage.setItem('user_data', JSON.stringify(response.data));
          this.router.navigate(['/apptabs/tabs/home']);
          this.loginForm.reset();
          this.isSubmitted = false;
        },
        error: (error: any) => {
          const errorMessage = error.error?.error || 'Invalid Email and Password';
          this.loader.hideLoading();
          if (errorMessage === 'Your email is not verified, Please verify it') {
            this.messageService.presentToast(errorMessage, 'danger');
            this.router.navigate([`/verify-email/${this.loginForm.get('email').value}/login`]);
          } else {
            this.messageService.presentToast(errorMessage, 'danger');
          }
        },
      });
    } else {
      Object.values(this.loginForm.controls).forEach((control) => control.markAsTouched());
    }
  }

  get formControls() {
    return this.loginForm.controls;
  }

  ngOnDestroy() {
    this.loader.hideLoading();
    Keyboard.removeAllListeners();
  }
}