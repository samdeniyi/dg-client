import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Credentials, CredentialsService } from './credentials.service';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';

export interface ILoginContext {
  userName: string;
  password: string;
  remember?: boolean;
}

const routes = {
  userLogin: 'Auth/login'
};

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService extends BaseService<ILoginContext> {
  constructor(private credentialsService: CredentialsService, private http: HttpClient) {
    super(http);
  }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: ILoginContext): Observable<ILoginContext> {
    // Replace by proper authentication call

    // const data = {
    //   username: context.userName,
    //   token: '123456'
    // };
    // this.credentialsService.setCredentials(data, context.remember);
    // return of(data);

    return this.sendPost(this.baseUrl(routes.userLogin), context);
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }
}
