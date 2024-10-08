import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddShopLocationPageRoutingModule } from './add-shop-location-routing.module';
import { AddShopLocationPage } from './add-shop-location.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    AddShopLocationPageRoutingModule
  ],
  declarations: [AddShopLocationPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AddShopLocationPageModule {}
