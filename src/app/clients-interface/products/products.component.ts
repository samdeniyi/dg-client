import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductsService} from '@app/clients-interface/products/products.service';
import {finalize} from 'rxjs/operators';
import {untilDestroyed} from '@app/core/until-destroyed';
import {Logger} from '@app/core/logger.service';
import {ToastrService} from 'ngx-toastr';
const log = new Logger('clients product');
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  allProducts: any;
  product: any;
  isLoading = false;

  constructor(private productService: ProductsService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  ngOnDestroy(): void {
  }

  getAllProducts() {
    const allProduct$ = this.productService.getProducts();
    this.isLoading = true;
    allProduct$.pipe(
      finalize(() => {
        this.isLoading = false;
      }),
      untilDestroyed(this)
    ).subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.allProducts = res.responseData;
          } else {
            this.toastr.error(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          }
        },
          err => {
            log.error(`userRegistration error: ${err}`);
          }
    );
  }

  getDetails(id: any) {
    log.info(id);
    this.isLoading = true;
    const getProductDetail = this.productService.getProductById(id);
    getProductDetail.pipe(
      finalize(() => {
        this.isLoading = false;
      }),
      untilDestroyed(this)
    ).subscribe(
      (res: any) => {
        if (res.responseCode === '00') {
          this.product = res.responseData;
          log.info(this.product);
        } else {
          this.toastr.error(res.message, undefined, {
            closeButton: true,
            positionClass: 'toast-top-right'
          });
        }
      },
      err => {
        log.error(`userRegistration error: ${err}`);
      }
    );
  }

}
