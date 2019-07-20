import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoansService } from '@app/loans/loans.service';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '@app/core/until-destroyed';
import { Logger } from '@app/core/logger.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('loan list');

@Component({
  selector: 'app-list-loans',
  templateUrl: './list-loans.component.html',
  styleUrls: ['./list-loans.component.scss']
})
export class ListLoansComponent implements OnInit, OnDestroy {
  myLoanList: any;
  isLoading = false;

  title = 'My loans';
  breadcrumbItem = [
    {
      title: 'Loans',
      cssClass: ''
    },
    {
      title: 'my loans',
      cssClass: 'active'
    }
  ];

  loanDetails: any;
  private modalRef: NgbModalRef;

  constructor(
    private toastr: ToastrService,
    private loanService: LoansService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getMyLoans();
  }

  ngOnDestroy(): void {}

  getMyLoans() {
    const myloans$ = this.loanService.myloans();
    myloans$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.myLoanList = res.responseData;
          } else {
            this.toastr.error(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          }
        },
        (err: any) => {
          log.error(err);
          this.toastr.error(err.message, 'ERROR!', {
            closeButton: true,
            positionClass: 'toast-top-right'
          });
        }
      );
  }

  onLiquidate(trans: any) {
    const data = {
      loanId: this.loanDetails.loanId,
      authorisationTransaction: {
        message: trans.message,
        reference: trans.reference,
        status: trans.status,
        trans: trans.trans,
        transaction: trans.transaction,
        trxref: trans.trxref,
        amount: this.loanDetails.loanAmount
      }
    };

    const liquidateloan$ = this.loanService.liquidateLoan(data);
    liquidateloan$
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.closeModal('');
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            log.info(res.responseData);
            this.getMyLoans();
            this.toastr.success(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          } else {
            this.toastr.error(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          }
        },
        (err: any) => {
          log.error(err);
          this.toastr.error(err.message, 'ERROR!', {
            closeButton: true,
            positionClass: 'toast-top-right'
          });
        }
      );
  }

  liquidateNow(view: any, loan: any) {
    this.isLoading = true;
    this.loanDetails = loan;

    this.loanService
      .getLiquidationrequest(loan.id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.loanDetails = res.responseData;
            if (this.loanDetails.totalAmount <= 0) {
              return this.toastr.error(
                'Total Amount can not be Zero',
                undefined,
                {
                  positionClass: 'toast-top-right'
                }
              );
            }
            this.modalRef = this.modalService.open(view, {
              windowClass: 'search small',
              backdrop: true
            });
          } else {
            this.toastr.error(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          }
        },
        (err: any) => {
          log.error(err);
          this.toastr.error(err.message, 'ERROR!', {
            closeButton: true,
            positionClass: 'toast-top-right'
          });
        }
      );
  }

  paymentDone(event: any) {
    const title = 'Payment successfull';
    this.toastr.success(title, '', {
      closeButton: true,
      positionClass: 'toast-top-right'
    });
    this.onLiquidate(event);
  }

  onViewRowDetail(loan: any, view: any) {
    this.loanDetails = loan;
    console.log(this.loanDetails);
    this.modalRef = this.modalService.open(view, {
      windowClass: 'search detail',
      backdrop: true
    });
  }

  closeModal(t: any) {
    this.loanDetails = null;
    this.modalRef.close();
  }
}
