import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';

const routes = {
  dashboardSummary: 'Dashboard/dashboardsummary',
  recentTransactions: 'Dashboard/recenttransaction'
};

@Injectable({
  providedIn: 'root'
})
export class HomeService extends BaseService<any> {
  constructor(private http: HttpClient) {
    super(http);
  }

  /**
   * Get Dashboard Summary
   * @return Dashboard Summary object
   */
  summary() {
    return this.sendGet(this.baseUrl(routes.dashboardSummary));
  }

  /**
   * Get Dashboard Summary
   * @return Dashboard Summary object
   */
  recentTransactions() {
    return this.sendGet(this.baseUrl(routes.recentTransactions));
  }
}
