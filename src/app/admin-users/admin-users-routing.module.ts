import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AddUserComponent } from '@app/admin-users/add-user/add-user.component';
import { ListUsersComponent } from '@app/admin-users/list-users/list-users.component';
import {extract} from '@app/core/i18n.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/admin', pathMatch: 'full' },
    { path: 'view', component: ListUsersComponent, data: { title: extract('view users') } },
    { path: 'add', component: AddUserComponent, data: { title: extract('add user') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUsersRoutingModule {}
