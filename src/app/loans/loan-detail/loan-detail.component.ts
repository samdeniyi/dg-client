import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoansService} from '@app/loans/loans.service';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {untilDestroyed} from '@app/core/until-destroyed';
import {Logger} from '@app/core/logger.service';
import {ToastrService} from 'ngx-toastr';

const log = new Logger('Loan details');

@Component({
  selector: 'app-loan-detail',
  templateUrl: './loan-detail.component.html',
  styleUrls: ['./loan-detail.component.scss']
})
export class LoanDetailComponent implements OnInit, OnDestroy {

  loanDetails: any;
  selLoanId: any;
  isLoading = false;
  product: any;

  public title = 'Apply for Loans';
  public breadcrumbItem: any ;

  constructor(private loansService: LoansService, private router: Router, private route:  ActivatedRoute,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.selLoanId = this.route.snapshot.paramMap.get('id');
    if (!this.selLoanId) {
      this.router.navigate(['/loans/view']);
    } else {
      this.getLoanDetails(this.selLoanId);
    }
  }

  ngOnDestroy(): void {
  }

  getLoanDetails(id: any) {
    log.info(id);
    this.isLoading = true;
    const getProductDetail = this.loansService.getProductById(id);
    getProductDetail.pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
    ).subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.loanDetails = res.responseData;
            log.info(this.loanDetails);
            this.title = `Apply for Loans (${this.loanDetails.product['name']})`;
            this.breadcrumbItem = [
              {
                title: 'Loans',
                cssClass: ''
              },
              {
                title: this.loanDetails.product['name'],
                cssClass: 'active'
              }
            ];
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
