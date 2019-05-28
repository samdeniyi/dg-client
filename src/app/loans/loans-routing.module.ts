import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {Shell} from '@app/shell/shell.service';
import {extract} from '@app/core/i18n.service';
import {ViewLoansComponent} from '@app/loans/view-loans/view-loans.component';
import {ListLoansComponent} from '@app/loans/list-loans/list-loans.component';
import {LoanDetailComponent} from '@app/loans/loan-detail/loan-detail.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/loans/view', pathMatch: 'full' },
    { path: 'loans/view', component: ViewLoansComponent, data: { title: extract('view loans') } },
    { path: 'loans/myloans', component: ListLoansComponent, data: { title: extract('list loans') } },
    { path: 'loans/details/:id', component: LoanDetailComponent, data: { title: extract('loan detail') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoansRoutingModule { }
