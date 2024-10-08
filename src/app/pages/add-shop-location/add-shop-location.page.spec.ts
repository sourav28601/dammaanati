import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddShopLocationPage } from './add-shop-location.page';

describe('AddShopLocationPage', () => {
  let component: AddShopLocationPage;
  let fixture: ComponentFixture<AddShopLocationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShopLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
