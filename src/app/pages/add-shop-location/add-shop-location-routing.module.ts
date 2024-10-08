import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddShopLocationPage } from './add-shop-location.page';

const routes: Routes = [
  {
    path: '',
    component: AddShopLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddShopLocationPageRoutingModule {}
