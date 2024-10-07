import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgOtpInputModule } from  'ng-otp-input';
import { VerifyEmailPageRoutingModule } from './verify-email-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { VerifyEmailPage } from './verify-email.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    VerifyEmailPageRoutingModule,
    NgOtpInputModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [VerifyEmailPage]
})
export class VerifyEmailPageModule {}
