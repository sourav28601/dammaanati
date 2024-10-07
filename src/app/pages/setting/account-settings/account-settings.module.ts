import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { AccountSettingsPageRoutingModule } from './account-settings-routing.module';

import { AccountSettingsPage } from './account-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AccountSettingsPageRoutingModule,
    TranslateModule
  ],
  declarations: [AccountSettingsPage]
})
export class AccountSettingsPageModule {}
