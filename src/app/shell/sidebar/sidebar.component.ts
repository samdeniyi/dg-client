import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThemeService } from '@app/services/theme.service';
import { Log } from '@angular/core/testing/src/logger';
import { Router } from '@angular/router';
import { Logger } from '@app/core/logger.service';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { environment } from '@env/environment';
import { HomeService } from '@app/home/home.service';

const log = new Logger('Sidebar');

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() sidebarVisible = true;
  @Input() navTab = 'menu';
  @Input() currentActiveMenu: any;
  @Input() currentActiveSubMenu: any;
  @Output() changeNavTabEvent = new EventEmitter();
  @Output() activeInactiveMenuEvent = new EventEmitter();
  public themeClass = 'theme-cyan';
  public loggedInUser: string;
  summary: any;
  featureLoan = environment.featureLoan;

  constructor(
    private themeService: ThemeService,
    private credentialsService: CredentialsService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private homeService: HomeService
  ) {
    this.themeService.themeClassChange.subscribe(themeClass => {
      this.themeClass = themeClass;
    });
  }

  ngOnInit() {
    this.loggedInUser = this.credentialsService.credentials.name;
    this.activeInactiveMenuEvent.emit({ item: 'admin' });
    this.getSummary();
  }

  getSummary() {
    this.homeService.summary().subscribe(
      res => {
        if (res.responseCode === '00') {
          console.log(res);
          this.summary = res.responseData;
        } else {
          console.log('this.summary', res);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  changeNavTab(tab: string) {
    this.navTab = tab;
  }

  activeInactiveMenu(menuItem: string) {
    this.activeInactiveMenuEvent.emit({ item: menuItem });
  }

  changeTheme(theme: string) {
    this.themeService.themeChange(theme);
  }

  logout() {
    this.authenticationService
      .logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  toggleSideMenu() {
    this.themeService.showHideMenu();
  }
}
