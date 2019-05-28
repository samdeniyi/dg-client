import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerifyEmailService } from '@app/verify-email/verify-email.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ISetPassword, SetpasswordService } from '@app/setpassword/setpassword.service';
import {Logger} from '@app/core/logger.service';
import {untilDestroyed} from '@app/core/until-destroyed';

const log = new Logger('SetPassword');

@Component({
  selector: 'app-setpassword',
  templateUrl: './setpassword.component.html',
  styleUrls: ['./setpassword.component.scss']
})
export class SetpasswordComponent implements OnInit, OnDestroy {
  public userId: string;
  public verificationCode: string;
  isLoading = false;
  resendVerificationLink = false;
  setPasswordForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: SetpasswordService,
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
      const setPassword = this.userService.setUserPassword(this.buildSetPasswordPayload(this.setPasswordForm.value));
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

  buildSetPasswordPayload(formObj: any): ISetPassword {
    const payload = {
      userId: this.userId,
      code: this.verificationCode,
      password: formObj.password,
      confirmPassword: formObj.confirmPassword
    };

    return payload;
  }
}
