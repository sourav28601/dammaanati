import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FeedbacksPageRoutingModule } from './feedbacks-routing.module';

import { FeedbacksPage } from './feedbacks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeedbacksPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [FeedbacksPage]
})
export class FeedbacksPageModule {}
