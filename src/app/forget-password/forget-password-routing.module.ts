import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgetPasswordComponent } from '@app/forget-password/forget-password.component';
import { extract } from '@app/core/i18n.service';

const routes: Routes = [
  {
    path: '',
    component: ForgetPasswordComponent,
    data: { title: extract('Forget password') }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgetPasswordRoutingModule {}
