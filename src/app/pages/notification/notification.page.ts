import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'src/app/core/services/message/message.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  selectedNotificationPreference: string | null = null;
  customDays: string = '';
  showErrorMessage: boolean = false;
  errorMessage: string = '';

  constructor(
    private languageService: LanguageService,
    private apiService: ApiService,
    private messageService: MessageService
  ) { 
    this.languageService.initLanguage();
  }

  ngOnInit() {
    this.getCurrentPreference();
  }

  onNotificationPreferenceChange(event: CustomEvent) {
    this.selectedNotificationPreference = event.detail.value;
    if (this.selectedNotificationPreference !== 'other') {
      this.customDays = '';
      this.showErrorMessage = false;
    }
  }

  onCustomDaysInput(event: any) {
    const input = event.target.value;
    if (input.length > 3) {
      event.target.value = input.slice(0, 3);
    }
    this.customDays = event.target.value;
    const numValue = parseInt(this.customDays, 10);

    this.showErrorMessage = false;
    this.errorMessage = '';

    if (numValue > 365) {
      this.customDays = '365';
      this.showErrorMessage = true;
      this.errorMessage = 'Days cannot be more than 365.';
    } else if (this.customDays.length > 3) {
      this.showErrorMessage = true;
      this.errorMessage = 'You cannot enter more than 3 digits.';
    } else if (numValue < 1) {
      this.customDays = '1';
    }
  }

  saveNotificationPreference() {
    let days: number;

    if (this.selectedNotificationPreference === 'other') {
      const numDays = parseInt(this.customDays, 10);
      if (!numDays || numDays < 1 || numDays > 365) {
        this.messageService.presentToast('Please enter a valid number of days (1-365)', 'warning');
        return;
      }
      days = numDays;
    } else {
      days = parseInt(this.selectedNotificationPreference!, 10);
    }

    const data = { days: days };

    this.apiService.updateNotificationPreferences(data).subscribe(
      (response) => {
        this.messageService.presentToast('Notification preferences updated successfully', 'success');
        console.log('response updateNotificationPreferences', response);
      },
      (error) => {
        console.error('Error updating notification preferences:', error);
        this.messageService.presentToast('Failed to update notification preferences', 'danger');
      }
    );
  }

  private getCurrentPreference() {
    this.apiService.getUserData().subscribe({
      next: (response: any) => {
        if (response.data && response.data.days !== null && response.data.days !== undefined) {
          const days = response.data.days;
          console.log("days-------", days);
          this.setSelectedPreference(days);
        } else {
          console.warn('Days preference not found or null in the response data');
          this.selectedNotificationPreference = null;
        }
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.selectedNotificationPreference = null;
      },
    });
  }

  private setSelectedPreference(days: number) {
    if (days === 14 || days === 30 || days === 60) {
      this.selectedNotificationPreference = days.toString();
    } else {
      this.selectedNotificationPreference = 'other';
      this.customDays = days.toString();
    }
    console.log("this.selectedNotificationPreference-------", this.selectedNotificationPreference);
  }
}



