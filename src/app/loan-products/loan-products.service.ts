import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IProductDetail {
  name: string;
  description: string;
  minLoanAmount: number;
  maxLoanAmount: number;
  minTenor: number;
  maxTenor: number;
  interestRate: number;
  rateType: number;
}

export interface IProductRequiredFields {
  formFieldId: number;
  isRequired: true;
}

export interface ILoanProduct {
  product: IProductDetail;
  productFormFields: Array<IProductRequiredFields>;
}

const routes = {
  getformfields: 'FormField/getformfields',
  createProduct: 'Product/createproduct',
  getAllProducts: 'Product/GetAllProducts'
};

@Injectable({
  providedIn: 'root'
})
export class LoanProductsService extends BaseService<ILoanProduct> {
  constructor(public http: HttpClient) {
    super(http);
  }

  getRequiredFormFields(): Observable<any> {
    return this.sendGet(this.baseUrl(routes.getformfields));
  }

  createLoanProduct(payload: ILoanProduct): Observable<any> {
    return this.sendPost(this.baseUrl(routes.createProduct), payload);
  }

  getCreatedLoanProducts(): Observable<any> {
    return this.sendGet(this.baseUrl(routes.getAllProducts));
  }
}
