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

  onLiquidated(id: number) {
    const liquidateloan$ = this.loanService.liquidateLoan(id);
    liquidateloan$
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
  }

  onViewRowDetail(loan: any, view: any) {
    this.loanDetails = loan;
    console.log(this.loanDetails);
    this.modalRef = this.modalService.open(view, {
      windowClass: 'search detail',
      backdrop: true
    });
  }

  closeModel(t: any) {
    this.loanDetails = null;
    this.modalRef.close();
  }
}
