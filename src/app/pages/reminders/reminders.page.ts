import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.page.html',
  styleUrls: ['./reminders.page.scss'],
})
export class RemindersPage implements OnInit {

  constructor() { }
  reminders = [
    { product: 'Washing Machine', category: 'Appliances', expiresIn: '13 Minutes', image: 'assets/rectangle-29715-3@2x.png' },
    { product: 'Washing Machine', category: 'Appliances', expiresIn: '1 Week', image: 'assets/rectangle-29715-3@2x.png' },
    { product: 'Washing Machine', category: 'Appliances', expiresIn: '1 Month', image: 'assets/rectangle-29715-1@2x.png' },
    { product: 'Washing Machine', category: 'Appliances', expiresIn: '1 Week', image: 'assets/rectangle-29715@2x.png' },
    { product: 'Washing Machine', category: 'Appliances', expiresIn: '11 Hours', image: 'assets/rectangle-29715-1@2x.png' },
  ];
  ngOnInit() {
  }

}
