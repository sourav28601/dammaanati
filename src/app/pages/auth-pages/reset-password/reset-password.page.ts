import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { LoaderService } from 'src/app/core/services/loader/loader.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetForm: FormGroup;
  otp: string;
  email: string;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private loader:LoaderService,
    private LanguageService: LanguageService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.LanguageService.initLanguage();
      this.otp = params['otp'];
      this.email = decodeURIComponent(params['email']);
      if (!this.otp || !this.email) {
        this.messageService.presentToast('OTP or Email not provided', 'danger');
        this.router.navigate(['/forgot-password']);
      }
    });

    this.resetForm = this.formBuilder.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.messageService.presentToast('Please fill all fields correctly', 'danger');
      return;
    }

    const data = {
      new_password: this.resetForm.value.newPassword,
      confirm_password: this.resetForm.value.confirmPassword,
      otp: this.otp,
      email: this.email
    };
    this.loader.showLoading()
    this.apiService.resetPassword(data).subscribe({
      next: (response: any) => {
        this.loader.hideLoading()
        this.messageService.presentToast(response.message || 'Password updated successfully', 'success');
        this.router.navigate(['/login']);
        this.resetForm.reset();
      },
      error: (error: any) => {
        this.loader.hideLoading()
        const errorMessage = error.error?.error || 'Invalid Password';
        this.messageService.presentToast(errorMessage, 'danger');
      },
    });
  }
}