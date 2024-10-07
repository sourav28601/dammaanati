import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectLanguagePage } from './select-language.page';

describe('SelectLanguagePage', () => {
  let component: SelectLanguagePage;
  let fixture: ComponentFixture<SelectLanguagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLanguagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
