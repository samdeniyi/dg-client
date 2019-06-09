import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '@app/shared';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    ResetPasswordRoutingModule,
      ReactiveFormsModule,
      SharedModule
  ]
})
export class ResetPasswordModule { }
