import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {BaseService} from '@app/core/base.service';
import {HttpClient} from '@angular/common/http';

const routes = {
  getAllProducts: 'Product/GetAllProducts',
  productById: 'Product/getproductbyid/'
};

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

}
