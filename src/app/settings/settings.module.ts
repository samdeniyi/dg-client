import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { RolesComponent } from './roles/roles.component';

@NgModule({
  declarations: [RolesComponent],
  imports: [CommonModule, SettingsRoutingModule]
})
export class SettingsModule {}
