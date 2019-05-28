import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from '@app/register/register-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [RegisterComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, RegisterRoutingModule]
})
export class RegisterModule {}
