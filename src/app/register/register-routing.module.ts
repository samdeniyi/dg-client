import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from '@app/register/register.component';
import {extract} from '@app/core/i18n.service';

const routes: Routes = [{ path: 'register', component: RegisterComponent, data: { title: extract('Register') } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RegisterRoutingModule {}
