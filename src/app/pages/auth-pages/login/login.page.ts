import { Component, OnInit,ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { Keyboard } from '@capacitor/keyboard';
import { IonContent } from '@ionic/angular'; 
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
  keyboardOpen = false;


  constructor(
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private languageService: LanguageService,
    private loader:LoaderService
    
  ) {
    this.languageService.initLanguage();
    this.initForm();
  }

  ngOnInit() {
    this.fcmToken = localStorage.getItem('fcm_token') || '';
  }
//  ionViewDidEnter() {
//     this.setupKeyboardListeners();
//   }

//   ionViewWillLeave() {
//     this.removeKeyboardListeners();
//   }

//   setupKeyboardListeners() {
//     window.addEventListener('keyboardWillShow', (event: any) => {
//       this.keyboardOpen = true;
//       this.content.scrollToBottom(300);
//     });

//     window.addEventListener('keyboardWillHide', () => {
//       this.keyboardOpen = false;
//     });
//   }

//   removeKeyboardListeners() {
//     window.removeEventListener('keyboardWillShow', null);
//     window.removeEventListener('keyboardWillHide', null);
//   }
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
      password: ['', [Validators.required]],
    });
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  onSubmit() {
    const email = this.loginForm.get('email')?.value;
    const page = 'login';
    if (this.loginForm.valid) {
      this.loader.showLoading();
      const formData = { ...this.loginForm.value, fcm_token: this.fcmToken };
      console.log('Form Data:', formData);
      this.apiService.login(formData).subscribe({
        next: (response: any) => {
          this.loader.hideLoading();
          this.messageService.presentToast(response.message || 'Login Successful', 'success');
          localStorage.setItem('user_data', JSON.stringify(response.data));
          this.router.navigate(['/apptabs/tabs/home']);
          this.loginForm.reset();
        },
        error: (error: any) => {
          // Extract error message from the response
          const errorMessage = error.error?.error || 'Invalid Email and Password';
          this.loader.hideLoading();
          // Check if the error message indicates the email is not verified
          if (errorMessage === 'Your email is not verified, Please verify it') {
            // Redirect to the verify email page and pass the email
            this.messageService.presentToast(errorMessage, 'danger');
            this.router.navigate([`/verify-email/${email}/${page}`]);
            this.loader.hideLoading();
          } else {
            this.loader.hideLoading();
            // Show the error toast for other error messages
            this.messageService.presentToast(errorMessage, 'danger');
          }
        },
        
      });
    } else {
      this.loader.hideLoading();
      Object.values(this.loginForm.controls).forEach((control) => control.markAsTouched());
    }
  }
  ngOnDestroy() {
    this.loader.hideLoading();
    Keyboard.removeAllListeners();
  }
}