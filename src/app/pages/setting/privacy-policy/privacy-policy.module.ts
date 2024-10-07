import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrivacyPolicyPageRoutingModule } from './privacy-policy-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { PrivacyPolicyPage } from './privacy-policy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacyPolicyPageRoutingModule,
    TranslateModule
  ],
  declarations: [PrivacyPolicyPage]
})
export class PrivacyPolicyPageModule {}
