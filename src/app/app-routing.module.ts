import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { OuterGuard } from './core/guards/outer.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'apptabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m=>m.TabsPageModule)
  },
  {
    path: '',
    redirectTo: 'welcome-screen',
    pathMatch: 'full'
  },
  {
    path: 'add-product',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/add-product/add-product.module').then( m => m.AddProductPageModule)
  },
  {
    path: 'product-details/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/product-details/product-details.module').then( m => m.ProductDetailsPageModule)
  },
  {
    path: 'login',
    canActivate: [OuterGuard],
    loadChildren: () => import('./pages/auth-pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'sign-up',
    canActivate: [OuterGuard],
    loadChildren: () => import('./pages/auth-pages/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'forgot-password',
    canActivate: [OuterGuard],
    loadChildren: () => import('./pages/auth-pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'verify-email/:email/:page',
    loadChildren: () => import('./pages/auth-pages/verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
  {
    path: 'welcome-screen',
    canActivate: [OuterGuard],
    loadChildren: () => import('./pages/auth-pages/welcome-screen/welcome-screen.module').then( m => m.WelcomeScreenPageModule)
  },
  {
    path: 'reset-password/:otp/:email',
    canActivate: [OuterGuard],
    loadChildren: () => import('./pages/auth-pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'select-language',
    canActivate: [OuterGuard],
    loadChildren: () => import('./pages/auth-pages/select-language/select-language.module').then( m => m.SelectLanguagePageModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'account-settings',
    loadChildren: () => import('./pages/setting/account-settings/account-settings.module').then( m => m.AccountSettingsPageModule)
  },
  {
    path: 'about',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/setting/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'term-conditions',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/setting/term-conditions/term-conditions.module').then( m => m.TermConditionsPageModule)
  },
  {
    path: 'feedbacks',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/setting/feedbacks/feedbacks.module').then( m => m.FeedbacksPageModule)
  },
  {
    path: 'help-and-support',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/setting/help-and-support/help-and-support.module').then( m => m.HelpAndSupportPageModule)
  },
  {
    path: 'privacy-policy',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/setting/privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'category-items/:id/:name',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/category-items/category-items.module').then( m => m.CategoryItemsPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./pages/notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'scanner-data',
    loadChildren: () => import('./pages/scanner-data/scanner-data.module').then( m => m.ScannerDataPageModule)
  },
  {
    path: 'qr-scanner',
    loadChildren: () => import('./pages/qr-scanner/qr-scanner.module').then( m => m.QrScannerPageModule)
  },
  {
    path: 'add-shop-location',
    loadChildren: () => import('./pages/add-shop-location/add-shop-location.module').then( m => m.AddShopLocationPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
