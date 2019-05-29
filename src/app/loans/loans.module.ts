import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoansRoutingModule } from './loans-routing.module';
import { ViewLoansComponent } from './view-loans/view-loans.component';
import { ListLoansComponent } from './list-loans/list-loans.component';
import {SharedModule} from '@app/shared';
import { LoanDetailComponent } from './loan-detail/loan-detail.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [ViewLoansComponent, ListLoansComponent, LoanDetailComponent],
  imports: [
    CommonModule,
    LoansRoutingModule,
      SharedModule,
      ReactiveFormsModule
  ]
})
export class LoansModule { }
