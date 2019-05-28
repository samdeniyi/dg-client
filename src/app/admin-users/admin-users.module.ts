import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminUsersRoutingModule } from './admin-users-routing.module';
import { AddUserComponent } from './add-user/add-user.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { SharedModule } from '@app/shared';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddUserComponent, ListUsersComponent, ViewUserComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, AdminUsersRoutingModule]
})
export class AdminUsersModule {}
