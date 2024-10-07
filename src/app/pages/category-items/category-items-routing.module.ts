import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryItemsPage } from './category-items.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryItemsPageRoutingModule {}
