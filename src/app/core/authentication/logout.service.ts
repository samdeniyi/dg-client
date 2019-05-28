import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {CredentialsService} from '@app/core/authentication/credentials.service';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private router: Router, private credentialsService: CredentialsService) { }

  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    this.router.navigate(['/login'], { replaceUrl: true });
    return of(true);
  }
}
