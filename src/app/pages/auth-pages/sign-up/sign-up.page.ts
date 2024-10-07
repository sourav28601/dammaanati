import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Country, City, ICountry, ICity } from 'country-state-city';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { LanguageService } from 'src/app/core/services/language/language.service';
 import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  signupForm: FormGroup;
  isTypePassword: boolean = true;
  isTypeConfirmPassword: boolean = true;
  countries: ICountry[] = [];
  cities: ICity[] = [];
  fcmToken: string;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService,
    private languageService: LanguageService,
    private http: HttpClient,
    private activeroute: ActivatedRoute,
  ){
    this.languageService.initLanguage();
    const desiredCountries = ['SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'IN'];
    this.countries = Country.getAllCountries().filter(country => 
      desiredCountries.includes(country.isoCode)
    );
  }
  ngOnInit() {
    this.activeroute.url.subscribe((url) => {
      this.initForm();
      this.getCurrentLocation();
    });
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      gender: ['', Validators.required],
      city: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/)]],
      confirmPassword: ['', Validators.required],
      country: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
  }

  onCountryChange(event: any) {
    const countryCode = event.detail.value;
    this.cities = City.getCitiesOfCountry(countryCode) || [];
  }

  togglePasswordVisibility() {
    this.isTypePassword = !this.isTypePassword;
  }
  
  toggleConfirmPasswordVisibility() {
    this.isTypeConfirmPassword = !this.isTypeConfirmPassword;
  }
 
  async getCurrentLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.fetchFormattedAddress(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      console.error('Error getting current position:', error);
      this.messageService.presentToast('Unable to get your location. Please enter it manually.', 'warning');
    }
  }

  fetchFormattedAddress(latitude: number, longitude: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
    
    this.http.get(url).subscribe(
      (data: any) => {
        if (data && data.address) {
          console.log('Address data:', data.address);
          const city = data.address.city || data.address.town || data.address.village;
          const countryCode = data.address.country_code.toUpperCase();
          console.log('Country code:', countryCode);
          if (city && countryCode) {
            const country = this.countries.find(c => c.isoCode === countryCode);
            if (country) {
              this.signupForm.patchValue({
                city: city,
                country: country.isoCode
              });
              this.onCountryChange({ detail: { value: country.isoCode } });
            }
          }
        }
      },
      (error) => {
        console.error('Error fetching address:', error);
        this.messageService.presentToast('Unable to determine your location. Please enter it manually.', 'warning');
      }
    );
  }

  onSubmit() {
    console.log("localStorage.getItem fcm-token---------",localStorage.getItem("fcm_token"));
    const email = this.signupForm.get('email')?.value;
    const page = 'sign-up';
    if (this.signupForm.valid) {
      const data = {
        country: this.signupForm.value.country,
        gender: this.signupForm.value.gender,
        email: this.signupForm.value.email,
        name: this.signupForm.value.name,
        password: this.signupForm.value.password,
        city: this.signupForm.value.city,
        fcm_token:localStorage.getItem("fcm_token")
      }
      this.apiService.signup(data).subscribe({
        next: (response: any) => {
          this.messageService.presentToast( response.message || 'Signup successful','success');
          // localStorage.setItem('user_data', JSON.stringify(response.data));
          this.router.navigate([`/verify-email/${email}/${page}`]);
          this.signupForm.reset();
        },
        error: (error) => {
          let errorMessage = error.error?.error || error.message || 'An unexpected error occurred';
          this.messageService.presentToast(errorMessage, 'danger');
        },
      });
    } else {
      this.messageService.presentToast('Please fill all required fields correctly', 'warning');
    }
  }
  ionViewWillLeave() {
    this.messageService.clearToast(); // Clear any lingering toasts before navigating away
  }
  
}