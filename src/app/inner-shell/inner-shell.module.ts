import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InnerShellComponent } from './inner-shell.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [InnerShellComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [InnerShellComponent]
})
export class InnerShellModule { }
