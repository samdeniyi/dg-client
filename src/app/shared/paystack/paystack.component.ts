import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '@env/environment';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-paystack',
  templateUrl: './paystack.component.html',
  styleUrls: ['./paystack.component.scss']
})
export class PaystackComponent implements OnInit {
  @Input() isDisabled: any;
  @Output() paymentDoneCallback = new EventEmitter<{ tRef: any }>();
  publicKey: any;
  userEmail: any;
  initailDebt: any;
  tRef = '';

  constructor(
    private toastr: ToastrService,
    private credentialService: CredentialsService
  ) {}

  ngOnInit() {
    this.setRandomPaymentRef();
    this.publicKey = environment.publicKey;
    this.initailDebt = environment.initailDebt;
    this.userEmail = this.credentialService.credentials.email;
  }

  setRandomPaymentRef() {
    this.tRef = `${Math.random() * 10000000000000}`;
  }

  paymentCancel() {
    const title = 'Validate your debt card to complete the application process';
    this.toastr.error(title, 'ERROR!', {
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }

  onPaymentDone() {
    console.log('onPaymentDone', this.tRef);
    this.paymentDoneCallback.emit({ tRef: this.tRef });
  }
}