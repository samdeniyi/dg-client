import { Injectable } from '@angular/core';
import { AdminUsersModule } from '@app/admin-users/admin-users.module';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IAdminUser {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  inviteCode: string;
  isAdmin: boolean;
  isDisabled: boolean;
  phoneNumber: string;
  roleId: 0;
}

const routes = {
  createAdminUser: 'User/createuser',
  getAdminUsers: 'User/getallusers'
};

@Injectable({
  providedIn: AdminUsersModule
})
export class AdminUsersService extends BaseService<IAdminUser> {
  constructor(public http: HttpClient) {
    super(http);
  }
  createAdminUser(payload: IAdminUser): Observable<any> {
    return this.sendPost(this.baseUrl(routes.createAdminUser), payload);
  }

  getAdminUsers(): Observable<any> {
    return this.sendGet(this.baseUrl(routes.getAdminUsers));
  }
}
