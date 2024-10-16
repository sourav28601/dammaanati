import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingController: LoadingController) {}

  async showLoading(message: string = 'Loading...') {
    if (!this.loading) {
      this.loading = await this.loadingController.create({
        message,
        spinner: 'circles',
        duration: 5000,
      });
      await this.loading.present();
    }
  }

  async hideLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null; 
    }
  }
}
