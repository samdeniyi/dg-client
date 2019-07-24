import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
declare var require: any;

import { QuoteService } from './quote.service';
import EChartOption = echarts.EChartOption;
import { untilDestroyed } from '@app/core/until-destroyed';
import { ToastrService } from 'ngx-toastr';

import { ActivatedRoute, Router } from '@angular/router';

import { Logger } from '@app/core/logger.service';

import { HomeService } from './home.service';
import { LoansService } from '@app/loans/loans.service';
import { finalize } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('home');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  quote: string | undefined;
  isLoading = false;
  summary: any;
  recentTransactions: any;
  userLoanList: any;

  public sidebarVisible = true;
  public title = 'Dashboard';

  public breadcrumbItem: any = [
    {
      title: 'Dashboard',
      cssClass: 'active'
    }
  ];

  public earningOptions: EChartOption = {};

  public salesOptions: EChartOption = {};

  public visitsAreaOptions: EChartOption = {};

  public LikesOptions: EChartOption = {};

  public stackedBarChart: EChartOption = {};

  public dataManagedBarChart: EChartOption = {};

  public earningOptionsSeries: Array<number> = [1, 4, 1, 3, 7, 1];
  public earnings: string =
    '₦' +
    (
      this.earningOptionsSeries.reduce((a, b) => a + b, 0) * 1000
    ).toLocaleString();
  public salesOptionsSeries: Array<number> = [1, 4, 2, 3, 6, 2];
  public sales: string =
    '₦' +
    (
      this.salesOptionsSeries.reduce((a, b) => a + b, 0) * 10000
    ).toLocaleString();
  public visitsAreaOptionsSeries: Array<number> = [1, 4, 2, 3, 1, 5];
  public visits: number = this.visitsAreaOptionsSeries.reduce(
    (a, b) => a + b,
    0
  );
  public LikesOptionsSeries: Array<number> = [1, 3, 5, 1, 4, 2];
  public likes: number = this.LikesOptionsSeries.reduce((a, b) => a + b, 0);

  public interval: any = {};
  private modalRef: NgbModalRef;
  loanDetails: any;

  constructor(
    private quoteService: QuoteService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private router: Router,
    private homeService: HomeService,
    private loanService: LoansService,
    private modalService: NgbModal
  ) {
    this.earningOptions = this.loadLineAreaChartOptions(
      [1, 4, 1, 3, 7, 1],
      '#f79647',
      '#fac091'
    );
    this.salesOptions = this.loadLineAreaChartOptions(
      [1, 4, 2, 3, 6, 2],
      '#604a7b',
      '#a092b0'
    );
    this.visitsAreaOptions = this.loadLineAreaChartOptions(
      [1, 4, 2, 3, 1, 5],
      '#4aacc5',
      '#92cddc'
    );
    this.LikesOptions = this.loadLineAreaChartOptions(
      [1, 3, 5, 1, 4, 2],
      '#4f81bc',
      '#95b3d7'
    );
    this.dataManagedBarChart = this.getDataManagedChartOptions();
  }

  ngOnInit() {
    // this.isLoading = true;
    // this.quoteService
    //   .getRandomQuote({ category: 'dev' })
    //   .pipe(
    //     finalize(() => {
    //       this.isLoading = false;
    //     })
    //   )
    //   .subscribe((quote: string) => {
    //     this.quote = quote;
    //   });

    const that = this;

    setTimeout(
      function() {
        that.showToastr();
      },

      1000
    );
    this.chartIntervals();

    this.getSummary();

    this.getUserLoan();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  showToastr() {
    this.toastr.info('Hello, welcome to DGPay.', undefined, {
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }

  chartIntervals() {
    const that = this;

    this.interval = setInterval(
      function() {
        that.earningOptionsSeries.shift();
        let rand = Math.floor(Math.random() * 11);

        if (!rand) {
          rand = 1;
        }

        that.earningOptionsSeries.push(rand);
        that.earningOptions = that.loadLineAreaChartOptions(
          that.earningOptionsSeries,
          '#f79647',
          '#fac091'
        );
        that.earnings =
          '₦' +
          (
            that.earningOptionsSeries.reduce((a, b) => a + b, 0) * 1000
          ).toLocaleString();

        that.salesOptionsSeries.shift();
        rand = Math.floor(Math.random() * 11);

        if (!rand) {
          rand = 1;
        }

        that.salesOptionsSeries.push(rand);
        that.salesOptions = that.loadLineAreaChartOptions(
          that.salesOptionsSeries,
          '#604a7b',
          '#a092b0'
        );
        that.sales =
          '₦' +
          (
            that.salesOptionsSeries.reduce((a, b) => a + b, 0) * 10000
          ).toLocaleString();

        that.visitsAreaOptionsSeries.shift();
        rand = Math.floor(Math.random() * 11);

        if (!rand) {
          rand = 1;
        }

        that.visitsAreaOptionsSeries.push(rand);
        that.visits += rand;
        that.visitsAreaOptions = that.loadLineAreaChartOptions(
          that.visitsAreaOptionsSeries,
          '#4aacc5',
          '#92cddc'
        );

        that.LikesOptionsSeries.shift();
        rand = Math.floor(Math.random() * 11);

        if (!rand) {
          rand = 1;
        }

        that.LikesOptionsSeries.push(rand);
        that.likes += rand;
        that.LikesOptions = that.loadLineAreaChartOptions(
          that.LikesOptionsSeries,
          '#4f81bc',
          '#95b3d7'
        );
        that.cdr.markForCheck();
      },

      3000
    );
  }

  loadLineAreaChartOptions(data: any, color: any, areaColor: any) {
    let chartOption: EChartOption;
    const xAxisData: Array<any> = new Array<any>();

    data.forEach((element: any) => {
      xAxisData.push('');
    });

    return (chartOption = {
      xAxis: {
        type: 'category',
        show: false,
        data: xAxisData,
        boundaryGap: false
      },

      yAxis: {
        type: 'value',
        show: false,
        min: 1
      },

      tooltip: {
        trigger: 'axis',
        formatter: function(params: any, ticket: any, callback: any) {
          return (
            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' +
            color +
            ';"></span>' +
            params[0].value
          );
        }
      },

      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '0%',
        containLabel: false
      },

      series: [
        {
          data: data,
          type: 'line',
          showSymbol: false,
          symbolSize: 1,
          lineStyle: {
            color: color,
            width: 1
          },

          areaStyle: {
            color: areaColor
          }
        }
      ]
    });
  }

  getDataManagedChartOptions() {
    const options: EChartOption = {
      tooltip: {
        trigger: 'item'
      },

      grid: {
        borderWidth: 0,
        y: 80,
        y2: 60
      },

      xAxis: [
        {
          type: 'category',
          show: false
        }
      ],
      yAxis: [
        {
          type: 'value',
          show: false
        }
      ],
      series: [
        {
          type: 'bar',
          stack: 'Gedgets',
          data: [2, 0, 5, 0, 4, 0, 8, 0, 3, 0, 9, 0, 1, 0, 5],
          itemStyle: {
            color: '#7460ee'
          },

          barWidth: '5px'
        },

        {
          type: 'bar',
          stack: 'Gedgets',
          data: [0, -5, 0, -1, 0, -9, 0, -3, 0, -8, 0, -4, 0, -5, 0],
          itemStyle: {
            color: '#afc979'
          },

          barWidth: '5px'
        }
      ]
    };

    return options;
  }

  goLoansList(): void {
    this.router.navigate(['/loans/details/23']);
  }

  getSummary() {
    this.homeService.summary().subscribe(
      res => {
        if (res.responseCode === '00') {
          console.log(res);
          this.summary = res.responseData;
        } else {
          console.log(res);
        }
      },

      error => {
        console.log(error);
      }
    );
  }

  getRecentTransactions() {
    this.homeService.recentTransactions().subscribe(
      res => {
        if (res.responseCode === '00') {
          console.log(res);
          this.recentTransactions = res.responseData;
        } else {
          console.log(res);
        }
      },

      error => {
        console.log(error);
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

  /*  liquidateNow(view: any) {
    this.isLoading = true;

    this.loanService
      .getUserLoans()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        res => {
          this.loanDetails = res.responseData[0];
          console.log('this.loanDetails', res);
          this.toastr.success(res.message, 'Success!');

          if (this.loanDetails) {
            this.modalRef = this.modalService.open(view, {
              windowClass: 'search small',
              backdrop: true
            });
          } else {
            this.toastr.success('You Have no Loan', 'Success!');
          }
        },
        error => {
          console.log(error);
          this.toastr.error(error.message, 'ERROR!');
        }
      );
  } */

  paymentDone(event: any) {
    const title = 'Payment successfull';
    console.log('paymentDone', event);
    // this.paystackResponse = ref.tRef;
    // console.log('this.paystackResponse', this.paystackResponse);
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
