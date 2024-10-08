import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScannerDataPage } from './scanner-data.page';

describe('ScannerDataPage', () => {
  let component: ScannerDataPage;
  let fixture: ComponentFixture<ScannerDataPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScannerDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
