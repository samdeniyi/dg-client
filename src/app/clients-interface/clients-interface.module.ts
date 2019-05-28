import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsInterfaceRoutingModule } from './clients-interface-routing.module';
import { ProductsComponent } from './products/products.component';
import {SharedModule} from '@app/shared';
import {InnerShellModule} from '@app/inner-shell/inner-shell.module';

@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    ClientsInterfaceRoutingModule,
    SharedModule,
    InnerShellModule
  ]
})
export class ClientsInterfaceModule { }
