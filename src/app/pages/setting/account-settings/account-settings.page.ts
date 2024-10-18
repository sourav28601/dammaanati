import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { UtilService } from 'src/app/core/services/utils/utils.service';
import { LoaderService } from 'src/app/core/services/loader/loader.service';
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.page.html',
  styleUrls: ['./account-settings.page.scss'],
})
export class AccountSettingsPage implements OnInit {
  changeEmailForm: FormGroup;
  changePasswordForm: FormGroup;
  userData: any;
  showNewPassword = false;
  showConfirmPassword = false;
  showOldPassword = false;
  @ViewChild('emailModal') emailModal!: IonModal;
  @ViewChild('passwordModal') passwordModal!: IonModal;
  currentLanguage:any;
  constructor(
    private formBuilder: FormBuilder,
    private activeroute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private messageService: MessageService,
    private modalCtrl: ModalController,
    private languageService:LanguageService,
    private utilService:UtilService,
    private loader:LoaderService
  ) {
    this.languageService.initLanguage();
  }

  ngOnInit() {
    this.currentLanguage = localStorage.getItem('language') || 'en';
    this.activeroute.url.subscribe((url) => {
      this.getUserData();
    });
    this.changeEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }
  

  openEmailModal() {
    this.emailModal.present().then(() => {
      console.log('Email Modal Opened');
    }).catch((err) => {
      console.error('Error opening email modal:', err);
    });
  }
  openPasswordModal() {
    this.passwordModal.present().then(() => {
      console.log('Password Modal Opened');
    }).catch((err) => {
      console.error('Error opening password modal:', err);
    });
  }
  dismissModal() {
    this.changePasswordForm.reset();
    this.modalCtrl.dismiss();
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
  toggleOldPasswordVisibility() {
    this.showOldPassword = !this.showOldPassword;
  }
  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getUserData() {
    this.loader.showLoading();
    this.apiService.getUserData().subscribe({
      next: (response: any) => {
        this.loader.hideLoading();
        console.log('this.userData==>', response);
        this.userData = response?.data;
        this.changeEmailForm.patchValue({ email: this.userData.email });
      },
      error: (error) => {
        this.loader.hideLoading();
        console.error('Error loading user data:', error);
      },
    });
  }

  onSubmit() {
    const email = this.changeEmailForm.get('email')?.value;
    const oldEmail = this.userData.email; 
    const page = 'account-settings';
    if (this.changeEmailForm.valid) {
      const data = {
        newEmail: this.changeEmailForm.value.email,
      };
      console.log('email data-----', data);
     this.loader.hideLoading();
      this.apiService.changeUserEmail(data).subscribe(
        {
          next: (response: any) => {
            this.loader.hideLoading();
            this.router.navigate([`/verify-email/${email}/${page}`]);
            this.messageService.presentToast(response.message || 'Email Changed Successfully', 'success');
            this.userData.email = data.newEmail;
            this.changeEmailForm.reset();
            this.changeEmailForm.patchValue({ email: data.newEmail });
            this.modalCtrl.dismiss(response);
          },
          
          error: (error: any) => {
            this.loader.hideLoading();
            console.log("error-----", error);
            const errorMessage = error.error?.message || 'Email Change failed';
            this.changeEmailForm.patchValue({ email: oldEmail });
            this.messageService.presentToast(errorMessage, 'danger');
            this.modalCtrl.dismiss(error);
          },
        }

      );
    }
  }

  onChangePasswordFormSubmit() {
    if (this.changePasswordForm.valid) {
      const data = {
        oldPassword: this.changePasswordForm.value.oldPassword,
        newPassword: this.changePasswordForm.value.newPassword,
        confirmPassword: this.changePasswordForm.value.confirmPassword
      };
      console.log('changePasswordForm data-----', data);
      this.loader.showLoading();
      this.apiService.changeUserPassword(data).subscribe(
        (response) => {
          this.loader.hideLoading();
          this.messageService.presentToast(
            'Password Changed Successfully',
            'success'
          );
          console.log('response changeUserPassword', response);
          this.changePasswordForm.reset();
          this.modalCtrl.dismiss(response);
        },
        (error) => {
          this.loader.hideLoading();
          console.error('Error changing Password:', error);
          this.messageService.presentToast('Old and New Password must be different', 'danger');
        }
      );
    } else {
      this.loader.hideLoading();
      Object.values(this.changePasswordForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
  switchLanguage(lang: string) {
    this.currentLanguage = lang;
    console.log("lang",lang);
    this.languageService.setLanguage(lang);
  }
  async deleteAccount() {
    const shouldSignOut = await this.utilService.showConfirmation({
      header: this.languageService.instant('DELETE_ACCOUNT'),
      message: this.languageService.instant('DELETE_ACCOUNT_CONFIRMATION'),
      confirmText: this.languageService.instant('DELETE_ACCOUNT'),
      cancelText: this.languageService.instant('CANCEL'),
    });
    if (shouldSignOut) {
      this.loader.showLoading()
      this.apiService.deleteAccount().subscribe({
        next: (response: any) => {
          this.loader.hideLoading()
          this.messageService.presentToast(response.message || 'Account Deleted Successfully', 'success');
          localStorage.removeItem('user_data');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 500);
        },
        error: (error) => {
          this.loader.hideLoading()
          const errorMessage = error.error?.error || 'Failed to delete account';
          this.messageService.presentToast(errorMessage, 'danger');
        },
      });
    }
  }
}
