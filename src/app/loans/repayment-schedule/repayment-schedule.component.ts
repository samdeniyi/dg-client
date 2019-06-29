import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoansService } from '@app/loans/loans.service';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '@app/core/until-destroyed';
import { ToastrService } from 'ngx-toastr';
import { Logger } from '@app/core/logger.service';

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
  repaymentList: any;

  constructor(
    private loanService: LoansService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.repaymentsSchedule();
  }

  ngOnDestroy(): void {}

  repaymentsSchedule(id: number = 48) {
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
}
