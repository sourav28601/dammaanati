import { AfterContentChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Swiper } from 'swiper';
import { Router } from '@angular/router';
import { SwiperOptions } from 'swiper/types';
import { IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { UtilService } from 'src/app/core/services/utils/utils.service';
@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.page.html',
  styleUrls: ['./welcome-screen.page.scss'],
})
export class WelcomeScreenPage implements OnInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  greetingMessage: any;
  fullText = "Manage your warranties effortlessly with our bilingual (Arabic/English) mobile app and web application.";
  displayText = '';
  showFullText = false;

  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    pagination: {
      clickable: true,
    },
    modules: [IonicSlides],
  
  };

  constructor(private router:Router,private utilsService:UtilService) {
    this.utilsService.initializeTheme();
  }

  ngOnInit() {
    this.truncateText();
  }

  navigateToSelectLanguage() {
    this.router.navigate(['/select-language']);
  }
 
  ngAfterContentChecked() {
    if (this.swiperRef?.nativeElement) {
      this.swiper = this.swiperRef.nativeElement.swiper;
    }
  }
  truncateText() {
    const words = this.fullText.split(' ');
    this.displayText = words.slice(0, 8).join(' ');
  }

  toggleText() {
    this.showFullText = !this.showFullText;
    if (this.showFullText) {
      this.displayText = this.fullText;
    } else {
      this.truncateText();
    }
  }
}