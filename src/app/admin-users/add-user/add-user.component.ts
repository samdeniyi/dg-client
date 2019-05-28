import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminUsersService, IAdminUser } from '@app/admin-users/admin-users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {Logger} from '@app/core/logger.service';

const log = new Logger('Admin-user/add-user');

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {
  public data: any = {};
  public userForm: FormGroup;

  public title = 'Create User';
  public breadcrumbItem: any = [
    {
      title: 'Users',
      cssClass: ''
    },
    {
      title: 'Create user',
      cssClass: 'active'
    }
  ];
  constructor(
    public fb: FormBuilder,
    public usersService: AdminUsersService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy(): void {}

  createForm() {
    this.userForm = this.fb.group({
      lastName: [null, Validators.required],
      email: [null, Validators.required],
      firstName: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      roleId: [null, Validators.required]
    });
  }

  buildCreateUserPayload(formObj: any): IAdminUser {
    const payload: IAdminUser = {
      userName: null,
      email: formObj.email,
      firstName: formObj.firstName,
      lastName: formObj.lastName,
      inviteCode: null,
      isAdmin: true,
      isDisabled: false,
      phoneNumber: formObj.phoneNumber,
      roleId: formObj.roleId
    };
    return payload;
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.usersService.createAdminUser(this.buildCreateUserPayload(this.userForm.value)).subscribe(
        (res: any) => {
          log.info(res);
          this.toastr.success(res.message, undefined, {
            closeButton: true,
            positionClass: 'toast-top-right'
          });
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/admin-users/view'], { replaceUrl: true });
        },
        (err: any) => {
          log.error(err);
        }
      );
    } else {
      log.debug(this.userForm.value);
    }
  }
}
