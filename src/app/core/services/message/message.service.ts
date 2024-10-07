import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  currentToast: any;

  constructor(
    private toastController: ToastController
  ) { }

async presentToast(msg?: any, color?: any, position?: any) {
  if (this.currentToast) {

    console.log('this.currentToast',this.currentToast)
    await this.currentToast.dismiss();
    this.currentToast = null;
  }

  const toast = await this.toastController.create({
    message: msg,
    duration: 3000,
    color: color,
    position: position,
    cssClass:"toast"

  });
  await toast.present();
  this.currentToast = toast;

}
async clearToast() {
  if (this.currentToast) {
    console.log('Clearing current toast:', this.currentToast);
    await this.currentToast.dismiss();
    this.currentToast = null;
  }
}
}
