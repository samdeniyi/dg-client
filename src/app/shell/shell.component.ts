import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SidebarService } from '@app/services/sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '@app/services/theme.service';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, AfterViewInit {
  public title = 'DGPay';
  public isStopLoading = false;
  public showNotifMenu = false;
  public showToggleMenu = false;
  public navTab = 'menu';
  public currentActiveMenu = 'light';
  public currentActiveSubMenu: any;
  public themeClass = 'theme-cyan';
  public smallScreenMenu = '';

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private themeService: ThemeService,
    private titleService: Title
  ) {
    this.activatedRoute.url.subscribe(url => {
      this.isStopLoading = false;
      this.getActiveRoutes();
    });

    this.themeService.themeClassChange.subscribe(themeClass => {
      this.themeClass = themeClass;
    });

    this.themeService.smallScreenMenuShow.subscribe(showMenuClass => {
      this.smallScreenMenu = showMenuClass;
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    const that = this;
    setTimeout(function() {
      that.isStopLoading = true;
    }, 1000);
  }

  toggleNotificationDropMenu() {
    this.showNotifMenu = !this.showNotifMenu;
  }

  toggleSettingDropMenu() {
    this.showToggleMenu = !this.showToggleMenu;
  }

  getActiveRoutes() {
    const segments: Array<string> = this.router.url.split('/');
    this.currentActiveMenu = segments[2];
    this.currentActiveSubMenu = segments[3];
  }

  activeInactiveMenu($event: any) {
    if ($event.item && $event.item === this.currentActiveMenu) {
      this.currentActiveMenu = '';
    } else {
      this.currentActiveMenu = $event.item;
    }
  }
}
