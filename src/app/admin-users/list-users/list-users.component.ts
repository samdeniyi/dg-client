import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminUsersService } from '@app/admin-users/admin-users.service';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '@app/core/until-destroyed';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit, OnDestroy {
  public title = 'View Users';
  public isLoading = false;
  public userObj: any;

  public breadcrumbItem: any = [
    {
      title: 'Users',
      cssClass: ''
    },
    {
      title: 'View users',
      cssClass: 'active'
    }
  ];
  constructor(private adminUsersService: AdminUsersService) {}

  ngOnInit() {
    this.getAdminUser();
  }

  ngOnDestroy(): void {}

  getAdminUser(): any {
    const adminUsers$ = this.adminUsersService.getAdminUsers();
    adminUsers$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.userObj = res.responseData;
          } else {
          }
        },
        (err: any) => {}
      );
  }
}
