import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductUpdateService {

  constructor() { }
  private productDeletedSource = new Subject<string>();

  productDeleted$ = this.productDeletedSource.asObservable();

  notifyProductDeleted(productId: string) {
    this.productDeletedSource.next(productId);
  }
}
