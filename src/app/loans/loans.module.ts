import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoansRoutingModule } from './loans-routing.module';
import { ViewLoansComponent } from './view-loans/view-loans.component';
import { ListLoansComponent } from './list-loans/list-loans.component';
import { SharedModule } from '@app/shared';
import { LoanDetailComponent } from './loan-detail/loan-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Angular4PaystackModule } from 'angular4-paystack';
import { RepaymentScheduleComponent } from './repayment-schedule/repayment-schedule.component';

@NgModule({
  declarations: [
    ViewLoansComponent,
    ListLoansComponent,
    LoanDetailComponent,
    RepaymentScheduleComponent
  ],
  imports: [
    CommonModule,
    LoansRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    Angular4PaystackModule
  ]
})
export class LoansModule {}
