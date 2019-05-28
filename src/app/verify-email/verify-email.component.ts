import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { VerifyEmailService } from '@app/verify-email/verify-email.service';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {Logger} from '@app/core/logger.service';
import {untilDestroyed} from '@app/core/until-destroyed';

const log = new Logger('Verify Email');

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  public userId: string;
  public verificationCode: string;
  isLoading = false;
  resendVerificationLink = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private verifyEmailService: VerifyEmailService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.queryParams.userId;
    this.verificationCode = this.route.snapshot.queryParams.code;
    this.verifyUserEmail();
  }

  ngOnDestroy() {}

  verifyUserEmail() {
    this.isLoading = true;
    const verify = this.verifyEmailService.confirmEmail(this.userId, this.verificationCode);
    verify
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
  }
}
