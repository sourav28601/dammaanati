import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScannerDataPage } from './scanner-data.page';

const routes: Routes = [
  {
    path: '',
    component: ScannerDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScannerDataPageRoutingModule {}
