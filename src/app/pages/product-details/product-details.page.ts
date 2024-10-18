import { Component, OnInit } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Share } from '@capacitor/share';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { UtilService } from 'src/app/core/services/utils/utils.service';
import { ProductUpdateService } from 'src/app/core/services/product-update/product-update.service';
import { LoaderService } from 'src/app/core/services/loader/loader.service';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  products = {
    name: 'Washing Machine',
    timeLeft: '11 months 28 days left',
    category: 'Appliances',
    warrantyStart: '10-June-2020',
    warrantyEnd: '09-June-2025',
    invoiceNo: '7823453754',
    reminder: '1 Month Before Expiry',
    notes: 'Not Specified',
    shopLocation: '',
  };
  shopPictureUrl: string;
  isImageLoaded: boolean = false;
  product: any;
  productId: string;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private utilsService: UtilService,
    private languageService: LanguageService,
    private productUpdateService: ProductUpdateService,
    private loader:LoaderService
  ) {
    this.languageService.initLanguage();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id');
      if (this.productId) {
        this.getProductDetail(this.productId);
      }
    });
  }
  preloadShopPicture() {
    this.isImageLoaded = false;  // Reset the loaded state
    
    // Ensure the API response contains the shopPictureUrl
    if (this.product?.shop_picture) {
      this.shopPictureUrl = this.product.shop_picture;

      const img = new Image();
      img.src = this.shopPictureUrl;

      // On successful image load, set the loaded state to true
      img.onload = () => {
        this.isImageLoaded = true;
      };

      // If there’s an error loading the image
      img.onerror = () => {
        this.handleShopPictureError();
      };
    } else {
      // If no shop picture is provided, handle accordingly
      this.handleShopPictureError();
    }
  }
  // Handle error when loading the shop picture
  handleShopPictureError() {
    this.shopPictureUrl = '';
    this.isImageLoaded = false;
  }

  getProductDetail(productId: string) {
    this.loader.showLoading();
    console.log('getProductDetail call hua productId------ 2121', productId);
    this.apiService.getProductDetails(productId).subscribe({
      next: (response: any) => {
        this.loader.hideLoading();
        console.log('productId------123', productId);
        this.product = response.data;
        console.log('response--------123', response);
        console.log('this.products-------', this.product);
      },
      error: (error) => {
        this.loader.hideLoading();
        console.error('Error loading product detail:', error);
      },
    });
  }
  get timeLeft() {
    const endDate = new Date(this.product?.warranty_end_date);
    const now = new Date();
    const timeDiff = endDate.getTime() - now.getTime();

    if (timeDiff < 0) {
      return 'Expired';
    }

    const daysLeft = Math.floor(timeDiff / (1000 * 3600 * 24));
    const monthsLeft = Math.floor(daysLeft / 30);
    const remainingDays = daysLeft % 30;

    if (monthsLeft > 0) {
      return `${monthsLeft} month${
        monthsLeft > 1 ? 's' : ''
      } ${remainingDays} day${remainingDays !== 1 ? 's' : ''} left`;
    } else {
      return `${remainingDays} day${remainingDays !== 1 ? 's' : ''} left`;
    }
  }

  get warrantyStart() {
    return new Date(this.product?.warranty_start_date).toLocaleDateString();
  }

  get warrantyEnd() {
    return new Date(this.product?.warranty_end_date).toLocaleDateString();
  }
  handleImageError() {
    this.product.shop_picture = null;
  }
  async shareProduct() {
    const formatDate = (date: string) => {
      return date ? new Date(date).toLocaleDateString() : 'Not available';
    };
  
    const getValueOrNA = (value: any) => value || 'Not available';
  
    const getImageUrl = (url: string, fallback: string = 'Not available') => {
      return url ? url : fallback;
    };
  
    const productDetails = `
  Product: ${getValueOrNA(this.product?.product_name)}
  Product Image: ${getImageUrl(this.product?.product_picture, 'Product image not available')}
  Category: ${getValueOrNA(this.product?.Category?.name)}
  Warranty Start Date: ${formatDate(this.product?.warranty_start_date)}
  Warranty End Date: ${formatDate(this.product?.warranty_end_date)}
  Purchase Date: ${formatDate(this.product?.purchase_date)}
  Invoice Image: ${getImageUrl(this.product?.invoice, 'Invoice image not available')}
  Shop Image: ${getImageUrl(this.product?.shop_picture, 'Shop image not available')}
  Shop Location: ${getValueOrNA(this.product?.shop_location)}
  Contact Person Name: ${getValueOrNA(this.product?.warranty_contact_person_name)}
  Contact Person Number: ${getValueOrNA(this.product?.warranty_contact_person_number)}
  Notes: ${getValueOrNA(this.product?.notes)}
  `;
  
    const data = {
      title: 'Dammanti - Your Warranty Management App',
      text: `I've been using Dammanti to manage all my product warranties and it's been a game-changer! Here's a product I'm tracking:\n\n${productDetails}\n\nNever miss a warranty claim again. It's easy to use, sends timely reminders, and keeps all your warranty information in one place. Give it a try!`,
      url: 'https://www.damaanati.com/',
      dialogTitle: 'Share Product Warranty Details',
    };
  
    try {
      await Share.share(data);
      console.log('Successfully shared product details');
    } catch (error) {
      console.error('Error sharing product details:', error);
    }
  }
  

  async deleteProductDetail(productId: string) {
    const shouldDelete = await this.utilsService.showConfirmation({
      header: '',
      message: `Do you want to delete this Product?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (shouldDelete) {
      this.messageService.presentToast(
        'Product deleted successfully',
        'success'
      );
      this.router.navigate(['/apptabs/tabs/home']);
      this.loader.showLoading();
      this.apiService.deleteProduct(productId).subscribe({
        next: (response: any) => {
          this.loader.hideLoading();
          console.log('Product deleted successfully');
          this.productUpdateService.notifyProductDeleted(productId);
        },
        error: (error) => {
          this.loader.hideLoading();
          console.error('Failed to delete product:', error);
          this.messageService.presentToast(
            'Failed to Delete Product. Please try again later.',
            'danger'
          );
        },
      });
    }
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = '../../../assets/product-image.svg';
    }
  }

  getProductImageSrc(product: any): string {
    return product && product.product_picture
      ? product.product_picture
      : '../../../assets/product-image.svg';
  }
}
