import { Injectable } from '@angular/core';
import {BaseService} from '@app/core/base.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const routes = {
  getAllProducts: 'Product/GetAllProducts',
  productById: 'Product/getproductbyid/'
};

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends BaseService<any>{

  allProducts: any;
  product: any;
  isLoading = false;

  constructor(public http: HttpClient) {
    super(http);
  }

  getProducts(): Observable<any> {
    return this.sendGet(this.baseUrl(routes.getAllProducts), true);
  }

  getProductById(id: any): Observable<any> {
    return this.sendGet(this.baseUrl(routes.productById + id), false);
  }
}
