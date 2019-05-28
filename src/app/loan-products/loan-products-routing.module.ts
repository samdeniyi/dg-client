import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { ListUsersComponent } from '@app/admin-users/list-users/list-users.component';
import { CreateProductComponent } from '@app/loan-products/create-product/create-product.component';
import { ListProductsComponent } from '@app/loan-products/list-products/list-products.component';
import {extract} from '@app/core/i18n.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/admin', pathMatch: 'full' },
    { path: 'create', component: CreateProductComponent, data: { title: extract('Create loan product') } },
    { path: 'list', component: ListProductsComponent, data: { title: extract('list loan products') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanProductsRoutingModule {}
