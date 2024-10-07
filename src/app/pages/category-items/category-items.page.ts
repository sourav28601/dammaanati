import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { LanguageService } from 'src/app/core/services/language/language.service';
@Component({
  selector: 'app-category-items',
  templateUrl: './category-items.page.html',
  styleUrls: ['./category-items.page.scss'],
})
export class CategoryItemsPage implements OnInit {
  categories: any;
  productsView = true;
  categoryView = false;
  productData: any;
  categoryItems: any;
  products: any;
  categoryName: string | null;
  categoryId: string;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private languageService:LanguageService
  ) {this.languageService.initLanguage();}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.categoryId = params.get('id');
      this.categoryName = params.get('name')
        ? decodeURIComponent(params.get('name')!)
        : null;
        
      if (this.categoryId) {
        this.getCategoryItems(this.categoryId);
      }
      if (this.categoryName) {
        console.log('Category Name:', this.categoryName);
      }
    });
  }
  navigateToUserProfile() {}

  getCategoryItems(categoryId: string) {
    this.apiService.getAllCatgoryItem(categoryId).subscribe({
      next: (response: any) => {
        this.categoryItems = response.data.products;
        console.log('this.categoryItems----------', this.categoryItems);
        this.processProducts();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }
  getExpirationClass(date: string | Date): { [key: string]: boolean } {
    if (!date) return {};

    const expirationDate = new Date(date);
    const currentDate = new Date();
    const oneMonthFromNow = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate()
    );
    console.log('oneMonthFromNow==>', oneMonthFromNow);
    if (expirationDate <= oneMonthFromNow && expirationDate >= currentDate) {
      console.log('oneMonthFromNow==>12', oneMonthFromNow);
      return { 'expiration-red': true };
    } else {
      console.log('oneMonthFromNow==>21', oneMonthFromNow);
      return { 'expiration-green': true };
    }
  }

  getRemainingTime(warrantyEndDate: string): string {
    const today = new Date();
    const expiryDate = new Date(warrantyEndDate);
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return 'Expired';
    } else if (daysDiff === 0) {
      return 'Expires today';
    } else if (daysDiff === 1) {
      return '1 day remaining';
    } else if (daysDiff <= 7) {
      return `${daysDiff} days remaining`;
    } else if (daysDiff <= 30) {
      const weeks = Math.floor(daysDiff / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} remaining`;
    } else if (daysDiff <= 365) {
      const months = Math.floor(daysDiff / 30);
      return `${months} month${months > 1 ? 's' : ''} remaining`;
    } else {
      const years = Math.floor(daysDiff / 365);
      return `${years} year${years > 1 ? 's' : ''} remaining`;
    }
  }

  processProducts() {
    if (this.categoryItems) {
      this.categoryItems = this.categoryItems.map((product) => ({
        ...product,
        remainingWarranty: this.getRemainingTime(product?.warranty_end_date),
      }));

      this.categoryItems.sort(
        (a, b) =>
          this.getDaysRemaining(a.warranty_end_date) -
          this.getDaysRemaining(b.warranty_end_date)
      );
      console.log('this.categoryItems==>', this.categoryItems);
    }
  }

  getDaysRemaining(warrantyEndDate: string): number {
    const today = new Date();
    const expiryDate = new Date(warrantyEndDate);
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  }
  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = '../../../assets/product-image.svg';
    }
  }
  getProductImageSrc(product: any): string {
    return product && product.product_picture ? product.product_picture : '../../../assets/product-image.svg';
  }
  navigateToAddProductDetail() {}

  navigateToSettings() {}
}
