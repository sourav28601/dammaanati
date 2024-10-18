import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { LoaderService } from 'src/app/core/services/loader/loader.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm: FormGroup;
  id: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private languageService:LanguageService,
    private loader:LoaderService
  ) {
    this.initForm();
  }
  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  initForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
      ]],
    });
  }
  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    const email = this.forgotPasswordForm.get('email')?.value;
    this.loader.showLoading();
    this.apiService.forgotPassword({ email }).subscribe({
      next: (response: any) => {
        this.loader.hideLoading();
        this.messageService.presentToast(response.message || 'Login Successful', 'success');
        // this.router.navigate(['/verify-email', email]);
        this.router.navigate([`/verify-email/${email}/forgot-password`]);
        this.forgotPasswordForm.reset();
      },
      error: (error: any) => {
        this.loader.hideLoading();
        const errorMessage = error.error?.error || 'Invalid Email';
        this.messageService.presentToast(errorMessage, 'danger');
      },
    });
  }
}