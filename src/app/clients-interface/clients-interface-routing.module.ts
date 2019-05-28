import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {extract} from '@app/core/i18n.service';
import {ProductsComponent} from '@app/clients-interface/products/products.component';

const routes: Routes = [
  { path: '', redirectTo: '/clients/cproducts', pathMatch: 'full' },
  { path: 'cproducts', component: ProductsComponent, data: { title: extract('Products') } }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsInterfaceRoutingModule { }
