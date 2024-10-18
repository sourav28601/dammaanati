import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { LoaderService } from 'src/app/core/services/loader/loader.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  productForm: FormGroup;
  productPictureUrl: string | ArrayBuffer | null = null;
  invoiceUrl: string | ArrayBuffer | null = null;
  shopPictureUrl: string | ArrayBuffer | null = null;
  categories: any;
  picture: any;
  maxDate: any;
  address: string;
  abc = false;
  isSubmitting: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private messageService: MessageService,
    private activeroute: ActivatedRoute,
    private router: Router,
    private loader:LoaderService,
    private languageService: LanguageService
  ) {
    this.languageService.initLanguage();
    this.getCategory();
  }

  ngOnInit() {
    this.initForm();
    this.getCategory();
    this.setDefaultDates();
    this.productForm.get('time_period')?.valueChanges.subscribe(() => {
      this.updateWarrantyEndDate();
    });

    this.activeroute.url.subscribe(url => {
      this.getCategory();
      this.setDefaultDates();
    });
    this.activeroute.paramMap.subscribe(() => {
      if (history.state.address) {
        this.address = history.state.address;
        this.productForm.patchValue({
          shop_location: this.address,
        });
      }
    });
  }
  openMap() {
    this.router.navigate(['/add-shop-location']);
  }
  initForm() {
    this.productForm = this.formBuilder.group({
      product_name: ['', Validators.required],
      category_id: ['', Validators.required],
      purchase_date: ['', Validators.required],
      time_period: ['6', Validators.required],
      warranty_start_date: ['', Validators.required],
      warranty_end_date: ['', Validators.required],
      shop_name: ['', Validators.required],
      warranty_contact_person_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      warranty_contact_person_number: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
      shop_location: ['', Validators.required],
      shop_picture: [null],
      product_picture: [null],
      invoice: [null],
      notes: ['', Validators.required],
    });
  }

  validatePhoneNumber(event: any) {
    const input = event.target as HTMLIonInputElement;
    const value = input.value as string;
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue !== value) {
      // If non-numeric characters were removed, update the input
      input.value = numericValue;
    }
    
    if (numericValue.length > 15) {
      // If the number is longer than 15 digits, truncate it
      input.value = numericValue.slice(0, 15);
    }
    
    // Update the form control value
    this.productForm.get('warranty_contact_person_number')?.setValue(input.value, { emitEvent: false });
  }

  validateContactPersonName(event: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^a-zA-Z ]/g, '');
    this.productForm.get('warranty_contact_person_name')?.setValue(value, { emitEvent: false });
  }

  getMinDate(): string {
    return this.getCurrentDate();
  }

  setDefaultDates() {
    const currentDate = this.getCurrentDate();
    this.productForm.patchValue({
      purchase_date: currentDate,
      warranty_start_date: currentDate
    });
    this.updateWarrantyEndDate();
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  formatDate(event: any, controlName: string) {
    if (!this.productForm) return;
    const value = event.target.value;
    
    const validControllers = ['purchase_date', 'warranty_end_date', 'warranty_start_date'];
    if (validControllers.includes(controlName)) {
      this.productForm.get(controlName)?.setValue(value, { emitEvent: false });
    }

    if (controlName === 'warranty_start_date') {
      this.updateWarrantyEndDate();
    }
  }

  updateWarrantyEndDate() {
    const startDateStr = this.productForm.get('warranty_start_date')?.value;
    const timePeriod = this.productForm.get('time_period')?.value;
    
    if (startDateStr && timePeriod) {
      const startDate = new Date(startDateStr);
      const endDate = new Date(startDate.setMonth(startDate.getMonth() + parseInt(timePeriod)));
      this.productForm.get('warranty_end_date')?.setValue(endDate.toISOString().split('T')[0], { emitEvent: false });
    }
  }

  onFileChange(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.productForm.patchValue({
        [controlName]: file
      });
      const reader = new FileReader();
      reader.onload = () => {
        if (controlName === 'product_picture') {
          this.productPictureUrl = reader.result;
        } else if (controlName === 'invoice') {
          this.invoiceUrl = reader.result;
        } else if (controlName === 'shop_picture') {
          this.shopPictureUrl = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(inputId: string) {
    const fileInput = document.getElementById(inputId) as HTMLElement;
    fileInput.click();
  }

  

  async takePicture(controlName: string) {
    try {
      // Open camera directly
      const image = await Camera.getPhoto({
        quality: 100,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera, // This will open the camera directly
      });
  
      if (image.dataUrl) {
        const blob = this.dataURLtoBlob(image.dataUrl);
        const file = new File([blob], `${controlName}_${new Date().getTime()}.jpg`, { type: 'image/jpeg' });
        
        this.productForm.patchValue({
          [controlName]: file
        });
  
        if (controlName === 'product_picture') {
          this.productPictureUrl = image.dataUrl;
        } else if (controlName === 'invoice') {
          this.invoiceUrl = image.dataUrl;
        } else if (controlName === 'shop_picture') {
          this.shopPictureUrl = image.dataUrl;
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'User cancelled photos app') {
        console.log('User cancelled photo selection');
      } else {
        this.messageService.presentToast('Error taking picture', 'danger');
      }
    }
  }
  

  getCategory() {
    this.apiService.getCategory().subscribe(
      (response: any) => {
        this.categories = response.data;
      },
      (error) => {
        this.messageService.presentToast('Error fetching categories', 'danger');
      }
    );
  }

  onSubmit() {
    if (this.productForm.valid && !this.isSubmitting) {
      this.loader.showLoading();
      this.isSubmitting = true;
      const formData = new FormData();
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (control && control.value !== null && control.value !== undefined) {
          if (key === 'product_picture' || key === 'invoice' || key === 'shop_picture') {
            if (control.value instanceof File) {
              formData.append(key, control.value, control.value.name);
            }
          } else {
            formData.append(key, control.value);
          }
        }
      });
  
      this.apiService.addProduct(formData).subscribe({
        next: (response: any) => {
          this.loader.hideLoading();
          this.router.navigate(['/apptabs/tabs/home']);
          this.messageService.presentToast(response.message || 'Product saved successfully', 'success');
          this.shopPictureUrl = null;
          this.invoiceUrl = null;
          this.productPictureUrl = null;
          this.productForm.reset();
          this.isSubmitting = false;
        },
        error: (error: any) => {
          this.isSubmitting = false;
          this.loader.hideLoading();

          // Handle validation errors
          if (error.error && error.error.validationErrors) {
            this.loader.hideLoading();
            this.handleValidationErrors(error.error.validationErrors);
          }
  
          const errorMessage = error.error?.message || 'Error saving product';
          this.messageService.presentToast(errorMessage, 'danger');
          console.error('API Error:', error);
          this.loader.hideLoading();
        }
      });
    } else {
      // Mark all controls as touched to display validation errors
      this.markFormGroupTouched(this.productForm);
      this.loader.hideLoading();
      // Display the first validation error sequentially
      const firstErrorMessage = this.getFirstErrorMessage();
      this.messageService.presentToast(firstErrorMessage, 'danger');
      console.log('Form Errors:', this.getFormValidationErrors());
    }
  }
  
  // Helper function to display the first validation error message in sequence
  getFirstErrorMessage(): string {
    const errorMessages = {
      product_name: 'Product name is required',
      category_id: 'Category is required',
      purchase_date: 'Purchase date is required',
      time_period: 'Time period is required',
      warranty_start_date: 'Warranty start date is required',
      warranty_end_date: 'Warranty end date is required',
      shop_name: 'Shop name is required',
      warranty_contact_person_name: 'Contact person name is required',
      warranty_contact_person_number: 'Contact number is required',
      shop_location: 'Shop location is required',
      notes:'Notes is required'
    };
  
    // Iterate through form controls in the desired order
    const fieldOrder = [
      'product_name',
      'category_id',
      'purchase_date',
      'time_period',
      'warranty_start_date',
      'warranty_end_date',
      'shop_name',
      'warranty_contact_person_name',
      'warranty_contact_person_number',
      'shop_location',
      'notes'
    ];
  
    for (const field of fieldOrder) {
      const control = this.productForm.get(field);
      if (control && control.invalid && control.touched) {
        // Check for specific validation errors
        if (control.hasError('required')) {
          return errorMessages[field];
        }
        if (field === 'warranty_contact_person_name' && control.hasError('pattern')) {
          return 'Contact person name should only contain letters';
        }
        if (field === 'warranty_contact_person_number' && control.hasError('pattern')) {
          return 'Contact number should be between 8 and 15 digits';
        }
      }
    }
  
    // Default message if no specific error found
    return 'Please fill in all required fields';
  }
  
  // Helper function to format field names into readable messages
  formatFieldName(fieldName: string): string {
    switch (fieldName) {
      case 'product_name':
        return 'Product name';
      case 'category_id':
        return 'Category';
      case 'purchase_date':
        return 'Purchase date';
      case 'time_period':
        return 'Time period';
      case 'warranty_start_date':
        return 'Warranty start date';
      case 'warranty_end_date':
        return 'Warranty end date';
      case 'shop_name':
        return 'Shop name';
      case 'warranty_contact_person_name':
        return 'Warranty contact person name';
      case 'warranty_contact_person_number':
        return 'Warranty contact person number';
      case 'shop_location':
        return 'Shop location';
      case 'notes':
        return 'Notes';
      default:
        return fieldName.replace('_', ' ').toLowerCase();
    }
  }
  
  
  handleValidationErrors(validationErrors: any) {
    Object.keys(validationErrors).forEach(field => {
      const control = this.productForm.get(field);
      if (control) {
        control.setErrors({ serverError: validationErrors[field] });
      }
    });
  }
  
  getFormValidationErrors() {
    const errors: any = {};
    Object.keys(this.productForm.controls).forEach(key => {
      const controlErrors = this.productForm.get(key)?.errors;
      if (controlErrors) {
        errors[key] = controlErrors;
      }
    });
    return errors;
  }
  

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // getFormValidationErrors() {
  //   const errors: any = {};
  //   Object.keys(this.productForm.controls).forEach(key => {
  //     const controlErrors = this.productForm.get(key)?.errors;
  //     if (controlErrors != null) {
  //       errors[key] = controlErrors;
  //     }
  //   });
  //   return errors;
  // }

  navigateToHome() {
    this.router.navigate(['/apptabs/tabs/home']);
  }

  private dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
}