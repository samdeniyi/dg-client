import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyEmailComponent } from './verify-email.component';
import { SharedModule } from '@app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { VerifyEmailRoutingModule } from '@app/verify-email/verify-email-routing.module';

@NgModule({
  declarations: [VerifyEmailComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, VerifyEmailRoutingModule]
})
export class VerifyEmailModule {}
