import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgetPasswordRoutingModule } from './forget-password-routing.module';
import { ForgetPasswordComponent } from './forget-password.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '@app/shared';

@NgModule({
  declarations: [ForgetPasswordComponent],
  imports: [
    CommonModule,
    ForgetPasswordRoutingModule,
      ReactiveFormsModule,
      SharedModule
  ]
})
export class ForgetPasswordModule { }
