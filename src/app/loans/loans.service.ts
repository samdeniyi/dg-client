import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {BaseService} from '@app/core/base.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

const routes = {
  getAllProducts: 'Product/GetAllProducts',
  productById: 'Product/getproductbyid/',
  createLoan: 'Loan/createloan',
  myLoans: 'Loan/getuserloans',
  repaymentSchedule: 'Repayment/repaymentschedule/',
  accountLookup: 'Loan/accountlookup',
  bvnLookup: 'Loan/bvnlookup',
    liquidateloan: 'Loan/liquidateloan/'
};


export interface ILoanFormFields {
       formFieldId: number;
       formFieldValue: string;
}

export interface ILoan {
        productId: number;
       productName: string;
       loanAmount: number;
       tenor: number;
       approvalStatus: boolean;
       isDisbursed: boolean;
       isLiquidated: boolean;
}

export interface IAccountDetail {
    accountNumber: string;
    accountName: string;
    bvn: number;
    bankCode: number;
    isPrimary: true;
    tenantId: string;
}

export interface IAuthorisationTransaction {
    message: string;
    reference: string;
    status: string;
    trans: string;
    transaction: string;
    trxref: string;
    amount: number;
}


export interface ICreateLoan {
    loan: ILoan;
    loanFormFields: Array<ILoanFormFields>;
    accountDetail: IAccountDetail;
    authorisationTransaction: IAuthorisationTransaction;
}

@Injectable({
  providedIn: 'root'
})
export class LoansService extends BaseService<any> {

  selectedLoan: any;
  selLoanSource = new BehaviorSubject(this.selectedLoan);
  currentLoanSelected = this.selLoanSource.asObservable();

  constructor(public http: HttpClient) {
    super(http);
  }

  getProducts(): Observable<any> {
    return this.sendGet(this.baseUrl(routes.getAllProducts), true);
  }

  getProductById(id: any): Observable<any> {
    return this.sendGet(this.baseUrl(routes.productById + id), true);
  }

  changeSelLoanObj(selLoanObj: string) {
    this.selLoanSource.next(selLoanObj);
  }

  loanApplication(payload: ICreateLoan): Observable<any> {
      return this.sendPost(this.baseUrl(routes.createLoan), payload);
  }

  myloans(): Observable<any>{
      return this.sendGet(this.baseUrl(routes.myLoans), true);
  }

  getPaystackBankList(): Observable<any> {
      return this.sendGet(environment.payStackBaseUrl + 'bank', true);
  }

  getRepaymentschedules(id: number): Observable<any> {
      return this.sendGet(this.baseUrl(routes.repaymentSchedule + id), true);
  }

  validateAccountNumber(accountNumber: number, bankCode: number): Observable<any> {
      return this.sendGet(this.baseUrl(`${routes.accountLookup}?bankCode=${bankCode}
      &accountNumber=${accountNumber}`), true);
  }

  validateBvnNumber(bvntNumber: number): Observable<any> {
      return this.sendGet(this.baseUrl(`${routes.bvnLookup}?bvn=${bvntNumber}`), true);
  }

  liquidateLoan(id: number): Observable<any> {
      return this.sendPost(this.baseUrl(routes.liquidateloan + id), {});
  }

}
