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

  loanRepayment(loanId: any): Observable<any> {
    const data = {
      loanId: loanId,
      repaymentScheduleId: 2,
      repaymentType: 1
    };
    return this.sendPost(this.baseUrl(routes.loanrepayment), data);
  }
}
