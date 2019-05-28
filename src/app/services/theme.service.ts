import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public themeClass = 'theme-cyan';
  public smallScreenMenu = '';
  themeClassChange: Subject<string> = new Subject<string>();
  smallScreenMenuShow: Subject<string> = new Subject<string>();
  constructor() {
    this.themeClassChange.subscribe(value => {
      this.themeClass = value;
    });
    this.smallScreenMenuShow.subscribe(value => {
      this.smallScreenMenu = value;
    });
  }

  themeChange(theme: string) {
    this.themeClassChange.next(theme);
  }

  showHideMenu() {
    if (!this.smallScreenMenu) {
      this.smallScreenMenuShow.next('offcanvas-active');
    } else {
      this.smallScreenMenuShow.next('');
    }
  }

  hideMenu() {
    this.smallScreenMenuShow.next('');
  }
}
