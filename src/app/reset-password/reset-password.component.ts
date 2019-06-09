import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ISetPassword} from '@app/setpassword/setpassword.service';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs/operators';
import {untilDestroyed} from '@app/core/until-destroyed';
import {Logger} from '@app/core/logger.service';
import {ResetPasswordService} from '@app/reset-password/reset-password.service';

const log = new Logger('reset password');

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  public userId: string;
  public verificationCode: string;
  isLoading = false;
  resendVerificationLink = false;
  setPasswordForm: FormGroup;
  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private userService: ResetPasswordService,
      private toastr: ToastrService,
      private fb: FormBuilder
  ) {
    this.userId = this.route.snapshot.queryParams.userId;
    this.verificationCode = this.route.snapshot.queryParams.code;
  }

  ngOnInit() {
    this.createform();
  }

  ngOnDestroy() {}

  createform() {
    this.setPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.setPasswordForm.valid) {
      this.isLoading = true;
      const setPassword = this.userService.resetPassword(this.buildSetPasswordPayload(this.setPasswordForm.value));
      setPassword
          .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
              untilDestroyed(this)
          )
          .subscribe(
              (res: any) => {
                log.info(res);
                if (res.responseCode === '00') {
                  this.resendVerificationLink = false;
                  this.toastr.success(res.message, undefined, {
                    closeButton: true,
                    positionClass: 'toast-top-right'
                  });
                  this.router.navigate(['/login']);
                } else {
                  this.toastr.error(res.message, undefined, {
                    closeButton: true,
                    positionClass: 'toast-top-right'
                  });
                  this.resendVerificationLink = true;
                }
              },
              (err: any) => {
                log.error(err);
                this.toastr.error(err.message, undefined, {
                  closeButton: true,
                  positionClass: 'toast-top-right'
                });
              }
          );
    } else {
      this.toastr.error('Please check the form', undefined, {
        closeButton: true,
        positionClass: 'toast-top-right'
      });
    }
  }

  buildSetPasswordPayload(formObj: any): any {
    const payload = {
      userId: this.userId,
      code: this.verificationCode,
      newPassword: formObj.password,
      confirmNewPassword: formObj.confirmPassword
    };

    return payload;
  }
}
