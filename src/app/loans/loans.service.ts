import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {BaseService} from '@app/core/base.service';
import {HttpClient} from '@angular/common/http';

const routes = {
  getAllProducts: 'Product/GetAllProducts',
  productById: 'Product/getproductbyid/',
  createLoan: 'Loan/createloan'
};

//loan": {
//    productId": 0,
//        productName":string",
//         "loanAmount": 0,
//         "loanType": 1,
//         "tenor": 0,
//         "approvalStatus": 1,
//         "isDisbursed": true,
//         "isLiquidated": true,
//         "id": 0,
//         "tenantId": "string"
// },
// "loanFormFields": [
//     {
//         "loanId": 0,
//         "formFieldId": 0,
//         "formFieldName": "string",
//         "formFieldValue": "string",
//         "createdDate": "2019-05-28T21:45:37.830Z",
//         "createdBy": "string",
//         "id": 0,
//         "tenantId": "string"
//     }
// ]

export interface ILoanFormFields {
       formFieldId: number;
       formFieldName: string;
       formFieldValue: string;
       tenantId: string;
}

export interface ILoan {
       productName: string;
       loanAmount: number;
       loanType: number;
       tenor: number;
       approvalStatus: boolean;
       isDisbursed: boolean;
       isLiquidated: boolean;
       id: number;
       tenantId: string;
}

export interface ICreateLoan {
    loan: ILoan;
    loanFormFields: Array<ILoanFormFields>;
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

}
