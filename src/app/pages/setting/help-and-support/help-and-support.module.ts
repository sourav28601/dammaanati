import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelpAndSupportPageRoutingModule } from './help-and-support-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { HelpAndSupportPage } from './help-and-support.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpAndSupportPageRoutingModule,
    TranslateModule
  ],
  declarations: [HelpAndSupportPage]
})
export class HelpAndSupportPageModule {}
