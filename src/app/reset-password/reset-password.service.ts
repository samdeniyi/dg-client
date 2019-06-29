import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const routes = {
  resetPassword: 'Auth/resetpassword'
};

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService extends BaseService<any> {
  constructor(public http: HttpClient) {
    super(http);
  }

  resetPassword(payload: any): Observable<any> {
    return this.sendPost(this.baseUrl(routes.resetPassword), payload);
  }
}
