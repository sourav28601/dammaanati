import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TermConditionsPage } from './term-conditions.page';

describe('TermConditionsPage', () => {
  let component: TermConditionsPage;
  let fixture: ComponentFixture<TermConditionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TermConditionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
