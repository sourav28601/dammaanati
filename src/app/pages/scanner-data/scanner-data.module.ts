import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScannerDataPageRoutingModule } from './scanner-data-routing.module';

import { ScannerDataPage } from './scanner-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScannerDataPageRoutingModule
  ],
  declarations: [ScannerDataPage]
})
export class ScannerDataPageModule {}
