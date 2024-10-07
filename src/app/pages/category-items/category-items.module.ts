import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryItemsPageRoutingModule } from './category-items-routing.module';

import { CategoryItemsPage } from './category-items.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryItemsPageRoutingModule,
    TranslateModule
  ],
  declarations: [CategoryItemsPage]
})
export class CategoryItemsPageModule {}
