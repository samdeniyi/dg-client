import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const routes = {
  verifyEmail: 'Auth/confirmemail'
};

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailService extends BaseService<any> {
  constructor(public http: HttpClient) {
    super(http);
  }
  confirmEmail(userId: string, verificationCode: string): Observable<any> {
    return this.sendPost(routes.verifyEmail, {
      userId: userId,
      code: verificationCode
    });
  }
}
