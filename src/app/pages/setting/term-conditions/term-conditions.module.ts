import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermConditionsPageRoutingModule } from './term-conditions-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { TermConditionsPage } from './term-conditions.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TermConditionsPageRoutingModule
  ],
  declarations: [TermConditionsPage]
})
export class TermConditionsPageModule {}
