import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

const routes = {
  loanrepayment: 'Repayment/loanrepayment'
};

@Injectable({
  providedIn: 'root'
})
export class RepaymentScheduleService extends BaseService<any> {
  constructor(public http: HttpClient) {
    super(http);
  }

  loanRepayment(data: any): Observable<any> {
    return this.sendPost(this.baseUrl(routes.loanrepayment), data);
  }
}
