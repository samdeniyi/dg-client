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
            this.userLoanList = res.responseData;
            this.loanDetails = res.responseData[0];
            log.info(this.userLoanList);
            this.repaymentsSchedule(this.userLoanList[0].id);
            this.loanAmount = this.userLoanList[0].loanAmount;
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
  /* 
  payNow(id: any, repaymentScheduleId: any) {
    this.repaymentScheduleService
      .loanRepayment(id, repaymentScheduleId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
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
  } */

  onRepayLoan(trans: any) {
    this.isLoading = true;
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
    console.log(this.loanDetails);
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
    // this.paystackResponse = ref.tRef;
    // console.log('this.paystackResponse', this.paystackResponse);
    this.toastr.success(title, '', {
      closeButton: true,
      positionClass: 'toast-top-right'
    });
    this.onRepayLoan(event);
  }

  closeModal(t: any) {
    this.loanDetails = null;
    this.modalRef.close();
  }
}
