import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from '@app/settings/roles/roles.component';
import { Shell } from '@app/shell/shell.service';
import {extract} from '@app/core/i18n.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/admin', pathMatch: 'full' },
    { path: 'roles', component: RolesComponent, data: { title: extract('Roles') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
