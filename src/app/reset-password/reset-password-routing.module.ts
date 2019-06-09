import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {extract} from '@app/core/i18n.service';
import {ResetPasswordComponent} from '@app/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', component: ResetPasswordComponent, data: { title: extract('reset password') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResetPasswordRoutingModule { }
