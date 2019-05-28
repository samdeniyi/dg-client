import { Component, OnDestroy, OnInit } from '@angular/core';
import { IRegister, IRegResponse, RegisterService } from '@app/register/register.service';
import { FormBuilder, FormGroup, RequiredValidator, Validator, Validators } from '@angular/forms';
import { EAlertMessageIcon, EAlertMessageType, IAlertMessage } from '@app/shared/alert-message/alert-message.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import {Logger} from '@app/core/logger.service';
import {untilDestroyed} from '@app/core/until-destroyed';

const log = new Logger('Register');

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  public regForm: FormGroup;
  public alertMessage: IAlertMessage;
  isLoading = false;

  constructor(private regService: RegisterService, private fb: FormBuilder, private toastr: ToastrService) {}

  ngOnInit() {
    this.createRegForm();
  }

  ngOnDestroy() {}

  onSubmit() {
    this.isLoading = true;
    if (this.regForm.valid) {
      const resgister$ = this.regService.userRegistration(this.buildPayload(this.regForm.value));
      resgister$
        .pipe(
          finalize(() => {
            this.regForm.markAsPristine();
            this.isLoading = false;
          }),
          untilDestroyed(this)
        )
        .subscribe(
          (res: any) => {
            log.info(`userRegistration response: ${res}`);
            if (res.responseCode === '00') {
              log.error(`userRegistration error: ${res.message}`);
              // this.alertMessage = {
              //   message: res.message,
              //   showClose: true,
              //   icon: EAlertMessageIcon.SUCCESS,
              //   type: EAlertMessageType.SUCCESS
              // };

              this.toastr.success(res.message, undefined, {
                closeButton: true,
                positionClass: 'toast-top-right'
              });
            } else {
              log.error(`userRegistration error: ${res.message}`);
              // this.alertMessage = {
              //   message: res.message,
              //   showClose: true,
              //   icon: EAlertMessageIcon.DANGER,
              //   type: EAlertMessageType.DANGER
              // };
              this.toastr.error(res.message, undefined, {
                closeButton: true,
                positionClass: 'toast-top-right'
              });
            }
          },
          err => {
            log.error(`userRegistration error: ${err}`);
          }
        );
    } else {
      this.toastr.error('Please fill all with *', undefined, {
        closeButton: true,
        positionClass: 'toast-top-right'
      });
    }
  }

  private createRegForm(): void {
    this.regForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
      phoneNumber: [null, Validators.required]
    });
  }

  private buildPayload(formDetails: IRegister): IRegister {
    const payload: IRegister = {
      firstName: formDetails.firstName,
      lastName: formDetails.lastName,
      email: formDetails.email,
      password: formDetails.password,
      phoneNumber: formDetails.phoneNumber,
      confirmPassword: formDetails.confirmPassword
    };

    return payload;
  }
}
