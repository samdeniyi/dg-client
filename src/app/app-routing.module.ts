import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // Fallback when no prior route is matched
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule'
  },
  {
    path: 'admin-users',
    loadChildren: './admin-users/admin-users.module#AdminUsersModule'
  },
  {
    path: 'products',
    loadChildren: './loan-products/loan-products.module#LoanProductsModule'
  },
  {
    path: 'clients',
    loadChildren: './clients-interface/clients-interface.module#ClientsInterfaceModule'
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
