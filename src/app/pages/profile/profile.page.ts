import { Component, ViewChild, AfterViewInit,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { UtilService } from 'src/app/core/services/utils/utils.service';
import { IonModal } from '@ionic/angular';
import { LoaderService } from 'src/app/core/services/loader/loader.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('profileModal') profileModal: IonModal;
  modalReady = false;
  userData: any;
  profileForm: FormGroup;
  profileImage: string | ArrayBuffer | null = 'assets/frame-1000009983.svg';
  originalProfileImage: string | null = 'assets/frame-1000009983.svg';;

  constructor(
    private formBuilder: FormBuilder,
    private activeroute: ActivatedRoute,
    private router: Router,
    private loader:LoaderService,
    private apiService: ApiService,
    private messageService: MessageService,
    private modalCtrl: ModalController,
    private utilService: UtilService,
    private languageService:LanguageService

  ) { 
    this.languageService.initLanguage();
  }

  ngOnInit() {
    this.initForm();
    this.activeroute.url.subscribe(url => {
      this.getUserData();
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.modalReady = true;
    }, 100);
  }

  openModal() {
    if (this.modalReady) {
      this.profileModal.present();
    }
  }


  noNumbersOrSpecialCharsValidator(control: AbstractControl) {
    const value = control.value;
    const forbiddenPattern = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  
    if (forbiddenPattern.test(value)) {
      return { forbiddenChars: true };
    }
  
    return null;
  }
  initForm() {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      profile_picture: [null]
    });
  }
  validateNameCityCountry(event: any, controlName: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^a-zA-Z ]/g, '');
    this.profileForm.get(controlName)?.setValue(value, { emitEvent: false });
  }
  getUserData() {
    this.apiService.getUserData().subscribe({
      next: (response: any) => {
        console.log('this.userData==>', response);
        this.userData = response?.data;
        this.profileForm.patchValue(response.data);
        this.profileImage = response.data.profile_picture;  // Set the current image
        this.originalProfileImage = response.data.profile_picture;  // Store the original image
        this.populateForm();
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      },
    });
  }

  populateForm() {
    if (this.userData) {
      this.profileForm.patchValue({
        name: this.userData.name,
        gender: this.userData.gender,
        city: this.userData.city,
        country: this.userData.country
      });
      if (this.userData.profile_picture) {
        this.profileImage = this.userData.profile_picture;
      }
    }
  }

  onFileChange(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.profileForm.patchValue({
        [controlName]: file
      });
      const reader = new FileReader();
      reader.onload = () => {
        if (controlName === 'profile_picture') {
          this.profileImage = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {

      const formData = new FormData();
      formData.append('name', this.profileForm.get('name')?.value);
      formData.append('gender', this.profileForm.get('gender')?.value);
      formData.append('city', this.profileForm.get('city')?.value);
      formData.append('country', this.profileForm.get('country')?.value);
      if (this.profileForm.get('profile_picture')?.value) {
        formData.append('profile_picture', this.profileForm.get('profile_picture')?.value);
      }
      this.loader.showLoading()
      this.apiService.updateUserProfile(formData).subscribe({
        next: (response: any) => {
          this.loader.hideLoading()
          this.messageService.presentToast(response.message || 'Profile updated successfully', 'success');
          this.getUserData();
          this.modalCtrl.dismiss(response);
        },
        error: (error: any) => {
          this.loader.hideLoading()
          const errorMessage = error.error?.error || 'Profile update failed';
          this.messageService.presentToast(errorMessage, 'danger');
        }
      });
    } else {
      this.loader.hideLoading()
      Object.values(this.profileForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
  uploadImage() {
    const fileInput = document.getElementById('image-input') as HTMLElement;
    fileInput.click();
  }
  cancelUpdate() {
    this.profileImage = this.originalProfileImage;
    this.profileForm.reset();
    this.getUserData();
    this.profileModal.dismiss();
  }
  async signOut() {
    const shouldSignOut = await this.utilService.showConfirmation({
      header: this.languageService.instant('SIGN_OUT'),
      message: this.languageService.instant('SIGN_OUT_CONFIRMATION'),
      confirmText: this.languageService.instant('SIGN_OUT'),
      cancelText: this.languageService.instant('STAY'),
    });
     if (shouldSignOut) {
      localStorage.removeItem('user_data')
      setTimeout(() => {
        this.router.navigate(['/login'])
      }, 500)
     }
   }
}
