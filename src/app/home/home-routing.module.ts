import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { Shell } from '@app/shell/shell.service';
import { extract } from '@app/core/i18n.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/admin', pathMatch: 'full' },
    { path: 'admin', component: HomeComponent, data: { title: extract('Home') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule {}
