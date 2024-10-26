import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { NgOtpInputModule } from 'ng-otp-input';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {
  email: string;
  otp: string;
  otpForm: FormGroup;
  page: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private LanguageService: LanguageService,
  ) {
    this.initForm();
  }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.LanguageService.initLanguage();
      const encodedEmail = params.get('email');
      this.page = params.get('page');  // Use 'get' to retrieve 'page'
      console.log('Navigated from:', this.page);
      if (encodedEmail) {
        this.email = decodeURIComponent(encodedEmail);
        console.log("this.email----",this.email);
      } else {
        console.error('Email not provided in route');
        this.messageService.presentToast('Email not provided', 'danger');
        this.router.navigate(['/forgot-password']);
      }
    });
  }

  initForm() {
    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });
  }
  verifyOTP() {
    if (this.otpForm.invalid) {
      this.messageService.presentToast('Please enter a valid OTP', 'danger');
      return;
    }
    const otp = this.otpForm.get('otp')?.value;
    const data = {
      email: this.email,
      otp: otp
    };
    this.apiService.verifyOtp(data).subscribe({
      next: (response: any) => {
        this.messageService.presentToast(response.message || 'OTP verified successfully', 'success');
        
        const isVerified = response.data.is_verified;
        const otp = data.otp; 
        console.log("otp-----",otp)
        console.log("isVerified----------", isVerified);
        console.log("this.page----------", this.page);
    
        if (isVerified) {
          if (this.page === 'sign-up') {
            localStorage.setItem('user_data', JSON.stringify(response.data));
            this.router.navigate(['/apptabs/tabs/home']);
          } else if (this.page === 'forgot-password') {
            console.log("else if condition run --------");
            this.router.navigate(['/reset-password', otp, this.email]);
          } else if (this.page === 'account-settings') {
            this.router.navigate(['/account-settings']);
          }else if (this.page === 'login') {
            localStorage.setItem('user_data', JSON.stringify(response.data));
            this.router.navigate(['/apptabs/tabs/home']);
          }
        } else {
          this.router.navigate(['/verify-email', data.email]);
        }
      },
      error: (error: any) => {
        const errorMessage = error.error?.error || 'Failed to verify otp!';
        this.messageService.presentToast(errorMessage, 'danger');
      },
    });
  }
  resendOTP() {
    const data = { email: this.email };
    this.apiService.resendOTP(data).subscribe({
      next: (response: any) => {
        this.messageService.presentToast(response.message || 'OTP resend successfully', 'success');
      },
      error: (error: any) => {
        const errorMessage = error.error?.error || 'Failed to send otp!';
        this.messageService.presentToast(errorMessage, 'danger');
      },
    });
  }

  onOtpChange(otp: string) {
    this.otpForm.get('otp')?.setValue(otp);
  }
}
