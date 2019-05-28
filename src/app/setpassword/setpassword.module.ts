import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetpasswordRoutingModule } from './setpassword-routing.module';
import { SetpasswordComponent } from '@app/setpassword/setpassword.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SetpasswordComponent],
  imports: [CommonModule, SetpasswordRoutingModule, ReactiveFormsModule]
})
export class SetpasswordModule {}
