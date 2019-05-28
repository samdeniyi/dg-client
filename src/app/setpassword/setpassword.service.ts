import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';

export interface ISetPassword {
  userId: string;
  code: string;
  password: string;
  confirmPassword: string;
}

const routes = {
  setPassword: 'User/setpassword'
};
@Injectable({
  providedIn: 'root'
})
export class SetpasswordService extends BaseService<ISetPassword> {
  constructor(http: HttpClient) {
    super(http);
  }

  setUserPassword(payload: ISetPassword): Observable<any> {
    return this.sendPost(this.baseUrl(routes.setPassword), payload);
  }
}
