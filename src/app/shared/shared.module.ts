import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { ActivityPostComponent } from './activity-post/activity-post.component';
import { BlockHeaderComponent } from './block-header/block-header.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { RouterModule } from '@angular/router';
import { DataTableComponent } from './data-table/data-table.component';
import { SortableDirective } from '@app/shared/directives/sortable.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GroupByPipe } from './pipes/group-by.pipe';
import { PaystackComponent } from './paystack/paystack.component';
import { Angular4PaystackModule } from 'angular4-paystack';

@NgModule({
  imports: [
    CommonModule,
    NgxEchartsModule,
    RouterModule,
    NgbModule,
    FormsModule,
    Angular4PaystackModule
  ],
  declarations: [
    LoaderComponent,
    AlertMessageComponent,
    ActivityPostComponent,
    BlockHeaderComponent,
    DataTableComponent,
    SortableDirective,
    GroupByPipe,
    PaystackComponent
  ],
  exports: [
    LoaderComponent,
    AlertMessageComponent,
    ActivityPostComponent,
    BlockHeaderComponent,
    DataTableComponent,
    GroupByPipe,
    PaystackComponent
  ]
})
export class SharedModule {}
