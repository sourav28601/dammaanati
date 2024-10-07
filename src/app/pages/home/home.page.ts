import {
  AfterContentChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Swiper } from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { SwiperContainer } from 'swiper/element';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { ProductUpdateService } from 'src/app/core/services/product-update/product-update.service';
import { UtilService } from 'src/app/core/services/utils/utils.service';

register();
interface ApiResponse {
  data: {
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
    };
  };
}

interface Product {
  id: string;
  product_name: string;
  product_picture: string;
  warranty_end_date: string;
  remainingWarranty?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  @ViewChild('swiper') swiperRef: ElementRef<SwiperContainer>;
  swiper?: Swiper;
  products: Product[] = [];
  currentPage = 1;
  totalPages = 1;
  loading = false;
  searchTerm: string = '';
  categories: any;
  categoryForm: FormGroup;
  productsView = true;
  categoryView = false;
  ads: any;
  profilePicture: any;
  scannedResult: string = '';
  constructor(
    private apiService: ApiService,
    private router: Router,
    private modalCtrl: ModalController,
    private activeroute: ActivatedRoute,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private languageService:LanguageService,
    private productUpdateService: ProductUpdateService,
    private utilService:UtilService
  ) {
    this.languageService.initLanguage();
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
    this.productUpdateService.productDeleted$.subscribe(deletedProductId => {
      this.removeProductFromList(deletedProductId);
    });
    // this.getLocalStorageData();
    // const data = localStorage.getItem('user_data');
    // console.log("get home page localstorage data-----",localStorage.getItem('user_data'));

  }
 
  ngOnInit(): void {
    console.log("get home page localstorage data-----",localStorage.getItem('user_data'));
  }
  getLocalStorageData() {
    const data = localStorage.getItem('user_data');
    console.log("get home page localstorage data-----",data);
  }
  ionViewWillEnter(){
    this.activeroute.url.subscribe((url) => {
      this.getUserData();
      this.loadProducts();
      this.loadCategories();
      this.getAds();
    });
  }
  ngAfterViewInit() {
    this.initSwiper();
  }
  initSwiper() {
    const swiperEl = this.swiperRef.nativeElement;
    const params = {
      slidesPerView: 1,
      spaceBetween: 20,
      zoom: false,
      loop: true,
      pagination: {
        clickable: true,
      },
    };

    Object.assign(swiperEl, params);
    swiperEl.initialize();
  }

  async startScanning() {
    try {
      const result = await this.utilService.startScan();
      if (result) {
        this.scannedResult = result;
        this.stopScanning();
      }
    } catch (error) {
      console.error('Scanning failed', error);
    }
  }
  stopScanning() {
    this.utilService.stopScan();
  }
  addCategory() {
    if (this.categoryForm.valid) {
      if (this.categoryForm.valid) {
        this.apiService.addCategory(this.categoryForm.value).subscribe({
          next: (response) => {
            console.log('Category added successfully', response);
            this.loadCategories();
            this.categoryForm.reset();
            this.modalCtrl.dismiss(response);
            this.messageService.presentToast(
              'Category Added Successfully',
              'success'
            );
          },
          error: (error) => {
            console.error('Error adding category', error);
            let errorMessage = 'Category Add Failed';
            if (error.error && error.error.error) {
              errorMessage = error.error.error;
            }
            this.modalCtrl.dismiss(error);
            this.categoryForm.reset();
            this.messageService.presentToast(errorMessage, 'danger');
          },
        });
      }
    }
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  loadProducts(page: number = 1) {
    if (this.loading || (page > 1 && page > this.totalPages)) return;
    this.loading = true;
    this.apiService
      .getAllProduct(page, this.searchTerm)
      .pipe(
        tap((response: ApiResponse) => {
          this.currentPage = response.data.pagination.currentPage;
          this.totalPages = response.data.pagination.totalPages;
        }),
        map((response: ApiResponse) => response.data.products)
      )
      .subscribe({
        next: (newProducts) => {
          if (page === 1) {
            this.products = newProducts;
          } else {
            this.products = [...this.products, ...newProducts];
          }
          this.processProducts();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.loading = false;
        },
      });
  }
  
  loadMore(event: any) {
    this.loadProducts(this.currentPage + 1);
    event.target.complete();
  }
  removeProductFromList(productId: string) {
    this.products = this.products.filter(product => product.id !== productId);
    if (this.products.length === 0 && this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts(this.currentPage);
    }
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

    if (expirationDate <= oneMonthFromNow && expirationDate >= currentDate) {
      return { 'expiration-red': true };
    } else {
      return { 'expiration-green': true };
    }
  }
  onSearch(event: any, type: string) {
    this.searchTerm = event.target.value.toLowerCase();
    if (type === 'products') {
      this.currentPage = 1;
      this.loadProducts();
    } else if (type === 'categories') {
      this.loadCategories();
    }
  }

  loadCategories() {
    this.apiService.getAllCategory(this.searchTerm).subscribe({
      next: (response: any) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      },
    });
  }

  getAds() {
    this.apiService.getAllAds().subscribe({
      next: (response: any) => {
        this.ads = response.data;
        console.log('this.ads----', this.ads);
      },
      error: (error) => {
        console.error('Error loading ads:', error);
      },
    });
  }

  ChangeUi(data: string) {
    this.productsView = data !== 'productsView';
    this.categoryView = data === 'productsView';
  }

  encodeURI(str: string): string {
    return encodeURIComponent(str);
  }

  navigateToAddProductDetail() {}

  navigateToSettings() {}

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
    if (this.products) {
      this.products = this.products.map((product) => ({
        ...product,
        remainingWarranty: this.getRemainingTime(product?.warranty_end_date),
      }));

      this.products.sort(
        (a, b) =>
          this.getDaysRemaining(a.warranty_end_date) -
          this.getDaysRemaining(b.warranty_end_date)
      );
      console.log('this.products==>', this.products);
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

  onProfileImgError(event: Event){
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = '../../../assets/profile-icon.svg';
    }
  }
  getUserData() {
    this.apiService.getUserData().subscribe({
      next: (response: any) => {
        if (response.data && response.data.profile_picture) {
          this.profilePicture = response.data.profile_picture;          ;
          console.log("this.profilePicture-------", this.profilePicture);
        } else {
          console.warn('Profile picture not found in the response data');
        }
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      },
    });
  }
  getProductImageSrc(product: any): string {
    return product && product.product_picture ? product.product_picture : '../../../assets/product-image.svg';
  }
}

