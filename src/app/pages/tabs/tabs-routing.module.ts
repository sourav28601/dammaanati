import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        canActivate: [AuthGuard],
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'setting',
        canActivate: [AuthGuard],
        loadChildren: () => import('../setting/setting.module').then( m => m.SettingPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/apptabs/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
