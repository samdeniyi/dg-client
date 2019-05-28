import {Component, OnDestroy, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs/operators';
import {untilDestroyed} from '@app/core/until-destroyed';
import {Logger} from '@app/core/logger.service';
import {LoansService} from '@app/loans/loans.service';
import {Router} from '@angular/router';

const log = new Logger('View loans');

@Component({
  selector: 'app-view-loans',
  templateUrl: './view-loans.component.html',
  styleUrls: ['./view-loans.component.scss']
})
export class ViewLoansComponent implements OnInit, OnDestroy {
  public title = 'Available Loans';
  public breadcrumbItem: any = [
    {
      title: 'Loans',
      cssClass: ''
    },
    {
      title: 'Available loan',
      cssClass: 'active'
    }
  ];

  allProducts: any;
  product: any;
  isLoading = false;


  constructor(private toastr: ToastrService, private loanService: LoansService,
              private router: Router) { }

  ngOnInit() {
    this.getAllProducts();
  }

  ngOnDestroy(): void {
  }

  getAllProducts() {
    const allProduct$ = this.loanService.getProducts();
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
  onApply(id: any) {
    log.info(id);
    this.isLoading = true;
    const getProductDetail = this.loanService.getProductById(id);
    getProductDetail.pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
    ).subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.product = res.responseData;
            this.loanService.changeSelLoanObj(this.product);
              this.router.navigate(['/loans/details', id]);
          } else {
            this.toastr.error(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          }
        },
        (err: any) => {
          log.error(`userRegistration error: ${err}`);
        }
    );
  }

}
