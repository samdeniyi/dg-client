import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoansService } from '@app/loans/loans.service';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '@app/core/until-destroyed';
import { ToastrService } from 'ngx-toastr';
import { Logger } from '@app/core/logger.service';
import { RepaymentScheduleService } from './repayment-schedule.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('repayment schedule');

@Component({
  selector: 'app-repayment-schedule',
  templateUrl: './repayment-schedule.component.html',
  styleUrls: ['./repayment-schedule.component.scss']
})
export class RepaymentScheduleComponent implements OnInit, OnDestroy {
  title = 'My Repayment schedules';
  isLoading = false;
  breadcrumbItem = [
    {
      title: 'Loans',
      cssClass: ''
    },
    {
      title: 'my repayment schedules',
      cssClass: 'active'
    }
  ];
  userLoanList: any;
  repaymentList: any;
  loanAmount: any;
  loanDetails: any;
  private modalRef: NgbModalRef;

  constructor(
    private loanService: LoansService,
    private toastr: ToastrService,
    private repaymentScheduleService: RepaymentScheduleService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getUserLoan();
  }

  ngOnDestroy(): void {}

  repaymentsSchedule(id: number) {
    const pSchedule$ = this.loanService.getRepaymentschedules(id);
    pSchedule$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            console.log('repaymentsSchedule', res.responseData);
            this.repaymentList = res.responseData;
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
  getUserLoan() {
    this.isLoading = true;
    const pLoans$ = this.loanService.getUserLoans();
    pLoans$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.userLoanList = res.responseData[res.responseData.length - 1];
            //this.loanDetails = res.responseData[0];
            log.info(this.userLoanList);
            this.repaymentsSchedule(this.userLoanList.id);
            this.loanAmount = this.userLoanList.loanAmount;
            console.log('this.userLoanList', this.userLoanList);
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

  onRepayLoan(trans: any) {
    this.isLoading = true;

    if (trans.penaltyAmount > 0) {
      console.log('trans.penaltyAmount', trans);
      this.loanDetails.loanAmount + trans.penaltyAmount;
    }

    const data = {
      loanId: this.loanDetails.loanId,
      repaymentScheduleId: this.loanDetails.id,
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
    console.log(data);

    const loanRepayment$ = this.repaymentScheduleService.loanRepayment(data);
    loanRepayment$
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

  onPayNow(view: any, loan: any) {
    this.loanDetails = loan;
    console.log('onPayNow', this.loanDetails);
    if (this.loanDetails) {
      this.modalRef = this.modalService.open(view, {
        windowClass: 'search small',
        backdrop: true
      });
    }
  }

  paymentDone(event: any) {
    const title = 'Payment successfull';
    console.log(this.title, event);
    this.toastr.success(title, '', {
      closeButton: true,
      positionClass: 'toast-top-right'
    });
    this.onRepayLoan(event);
  }

  /* Liquidation */
  onLiquidate(trans: any) {
    this.isLoading = true;

    console.log('this.loanDetails', this.loanDetails);
    const data = {
      loanId: this.loanDetails.loanId,
      authorisationTransaction: {
        message: trans.message,
        reference: trans.reference,
        status: trans.status,
        trans: trans.trans,
        transaction: trans.transaction,
        trxref: trans.trxref,
        amount: this.loanDetails.totalAmount
      }
    };

    console.log('data', data);
    this.loanService
      .liquidateLoan(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.closeModal('');
        })
      )
      .subscribe(
        res => {
          if (res.responseCode === '00') {
            console.log(res);
            this.toastr.success(res.message, 'Success!');
          } else {
            this.toastr.error(res.message, 'ERROR!');
          }
        },
        error => {
          console.log(error);
          this.toastr.error(error.message, 'ERROR!');
        }
      );
  }

  liquidateNow(view: any) {
    this.isLoading = true;
    this.loanDetails = this.userLoanList;

    this.loanService
      .getLiquidationrequest(this.userLoanList.id)
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

  liquidatPaymentDone(event: any) {
    const title = 'Payment successfull';
    console.log('paymentDone', event);

    this.toastr.success(title, '', {
      closeButton: true,
      positionClass: 'toast-top-right'
    });
    this.onLiquidate(event);
  }

  closeModal(t: any) {
    this.loanDetails = null;
    this.modalRef.close();
  }
}
