import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';

export const FCM_TOKEN = 'push_notification_token';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  private _redirect = new BehaviorSubject<any>(null);

  get redirect() {
    return this._redirect.asObservable();
  }
  constructor() { }

  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }

  private async registerPush() {
    try {
      await this.addListeners();
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }

      await PushNotifications.register();
    } catch (e) {
      console.log(e);
    }
  }

  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }

  addListeners() {
    PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        console.log('My token: ', token);
       
        const fcm_token = token?.value;
        // alert(fcm_token)
        console.log('fcm_token==>abhi', fcm_token);
        localStorage.setItem("fcm_token", fcm_token);
        let go = 1;
        const saved_token = localStorage.getItem(FCM_TOKEN);
        if (saved_token) {
          if (fcm_token === saved_token) {
            console.log('same token');
            go = 0;
          } else {
            go = 2;
          }
        }
        if (go === 1) {
          localStorage.setItem(FCM_TOKEN, fcm_token);
        } else if (go === 2) {
          localStorage.setItem(FCM_TOKEN, fcm_token);
        }
      }
    );
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
        const data = notification?.data;
        if (data?.redirect) this._redirect.next(data?.redirect);
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        console.log('push data: ', data);
        if (data?.redirect) this._redirect.next(data?.redirect);
      }
    );
  }

  removeFcmToken() {
    try {
      localStorage.removeItem(FCM_TOKEN);
    } catch (e) {
      console.log(e);
      throw (e);
    }
  }
}