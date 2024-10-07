import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeScreenPageRoutingModule } from './welcome-screen-routing.module';

import { WelcomeScreenPage } from './welcome-screen.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomeScreenPageRoutingModule
  ],
  declarations: [WelcomeScreenPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WelcomeScreenPageModule {}
