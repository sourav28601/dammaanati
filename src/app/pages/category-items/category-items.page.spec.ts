import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryItemsPage } from './category-items.page';

describe('CategoryItemsPage', () => {
  let component: CategoryItemsPage;
  let fixture: ComponentFixture<CategoryItemsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
