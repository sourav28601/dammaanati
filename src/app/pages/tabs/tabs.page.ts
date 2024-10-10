import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { UtilService } from 'src/app/core/services/utils/utils.service';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild(IonTabs) tabs!: IonTabs;
  selectTab: string = 'home';
  isScannerActive$:any


  constructor(private activatedRoute: ActivatedRoute, private router: Router,private utilsService:UtilService) {
    this.isScannerActive$ = this.utilsService.isScannerActive$;

  }

  ngOnInit() {
    this.activatedRoute.url.subscribe(url => {
    });
  }

  setCurrentTab() {
    this.selectTab = this.tabs.getSelected() || 'home';
  }

  navigate() {
    this.router.navigate(['/add-product']);
  }
}