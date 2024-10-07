import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AddProductPageRoutingModule } from './add-product-routing.module';
import { AddProductPage } from './add-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddProductPageRoutingModule,
    TranslateModule
  ],
  declarations: [AddProductPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AddProductPageModule {}
