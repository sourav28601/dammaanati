import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OuterGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userData = localStorage.getItem('user_data');
    if (!userData) {
      console.log('OuterGuard: No user data found');
      return true;
    } else {
      console.log('OuterGuard: User data found, redirecting to home');
      return this.router.createUrlTree(['/apptabs/tabs/home']);
    }
  }
}