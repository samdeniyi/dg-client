import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  IAccountDetail,
  IAuthorisationTransaction,
  ICreateLoan,
  ILoan,
  ILoanFormFields,
  LoansService
} from '@app/loans/loans.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '@app/core/until-destroyed';
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { environment } from '@env/environment';
import { formatCurrency } from '@angular/common';

const log = new Logger('Loan details');

@Component({
  selector: 'app-loan-detail',
  templateUrl: './loan-detail.component.html',
  styleUrls: ['./loan-detail.component.scss']
})
export class LoanDetailComponent implements OnInit, OnDestroy {
  loanDetails: any;
  selLoanId: any;
  isLoading = false;
  isValidBvn = false;
  product: any;
  activeTab = '';
  showRequiredFields = false;
  showAccountDetail = false;
  amountToBorrow: any;
  createLoanObj: ICreateLoan;
  loanDetailForm: FormGroup;
  accountForm: FormGroup;
  requiredFieldForm: FormGroup;
  authorisationCode: any;
  accountName: any;
  accountNumber: any;
  accValidationErr: any;
  userBvn: any;
  tRef = '';
  pBankList: any;
  userEmail: any;
  publicKey: any;
  initailDebt: any;
  borrowerMsg: any;
  isValidAcc = false;
  paystackAuthAmount = '5000';
  paystackResponse: any;

  public title = 'Apply for Loans';
  public breadcrumbItem: any;
  public RateType = {
    1: 'Days',
    2: 'Weeks',
    3: 'Months',
    4: 'year'
  };

  tenorInWords: any;

  constructor(
    private loansService: LoansService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private credentialService: CredentialsService
  ) {}

  ngOnInit() {
    this.selLoanId = this.route.snapshot.paramMap.get('id');
    if (!this.selLoanId) {
      this.router.navigate(['/loans/view']);
    } else {
      this.getLoanDetails(this.selLoanId);
      this.initCreateLoanForm();
      this.initAccountForm();
      this.setRandomPaymentRef();
      this.getBankList();
      this.publicKey = environment.publicKey;
      this.initailDebt = environment.initailDebt;
      this.userEmail = this.credentialService.credentials.email;
    }
  }

  ngOnDestroy(): void {}

  getLoanDetails(id: any) {
    log.info(id);
    this.isLoading = true;
    const getProductDetail = this.loansService.getProductById(id);
    getProductDetail
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.loanDetails = res.responseData;
            this.initRequiredFieldForm();
            log.info(this.loanDetails);
            this.title = `Apply for Loans (${
              this.loanDetails.product['name']
            })`;
            this.setTenor(this.loanDetails.product['rateType']);
            this.breadcrumbItem = [
              {
                title: 'Loans',
                cssClass: ''
              },
              {
                title: this.loanDetails.product['name'],
                cssClass: 'active'
              }
            ];
          } else {
            this.toastr.error(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          }
        },
        (err: any) => {
          log.error(`userRegistration error: ${err}`);
        }
      );
  }

  tabChange(title: string) {
    if (this.activeTab !== title) {
      this.activeTab = title;
      if (this.activeTab === 'loanDetails') {
        this.showRequiredFields = false;
        this.showAccountDetail = false;
      } else if (this.activeTab === 'requiredFields') {
        this.showRequiredFields = true;
        this.showAccountDetail = false;
      } else if (this.activeTab === 'accountDetail') {
        this.showRequiredFields = false;
        this.showAccountDetail = true;
      }
    }
  }

  initCreateLoanForm(): void {
    this.loanDetailForm = this.fb.group({
      loanAmount: [null, Validators.required],
      tenor: [null, Validators.required]
    });
  }

  initRequiredFieldForm(): void {
    const group = {};
    this.loanDetails.productFormFields.map((m: any) => {
      group[m.formFieldName] = new FormControl('', Validators.required);
    });
    this.requiredFieldForm = new FormGroup(group);
  }

  onSubmit() {
    if (this.loanDetailForm.valid) {
      this.tabChange('requiredFields');
    }
  }

  onBlurRequiredField(event: any, obj: any, i: any) {
    this.loanDetails.productFormFields[i].fieldValue = event.target.value;
  }
  onSubmitRequiredField() {
    if (this.loanDetailForm.valid) {
      this.tabChange('accountDetail');
    }
  }

  onSaveLoanApplication() {
    if (this.requiredFieldForm.valid) {
      this.isLoading = true;
      const payload: ICreateLoan = {
        loan: this.buildLoanObj(),
        loanFormFields: this.buildRequiredFieldObj(),
        accountDetail: this.buildAccountDetailObj(),
        authorisationTransaction: this.buildAuthorisationTransactionObj()
      };
      const createLoan = this.loansService.loanApplication(payload);
      createLoan
        .pipe(
          finalize(() => {
            this.isLoading = false;
          }),
          untilDestroyed(this)
        )
        .subscribe(
          (res: any) => {
            if (res.responseCode === '00') {
              this.toastr.success(res.message, undefined, {
                closeButton: true,
                positionClass: 'toast-top-right'
              });
              this.router.navigate(['/loans/myloans']);
            } else {
              this.toastr.error(res.message, undefined, {
                closeButton: true,
                positionClass: 'toast-top-right'
              });
            }
          },
          (err: any) => {
            log.error(err);
            this.toastr.error(err.message, 'ERROR!', {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          }
        );
    }
  }

  buildRequiredFieldObj(): Array<ILoanFormFields> {
    const loanFormFieldsArr = <any>[];
    for (const m of this.loanDetails.productFormFields) {
      log.info(m);
      loanFormFieldsArr.push({
        formFieldId: m.formFieldId,
        formFieldValue: m.fieldValue
      });
    }
    return loanFormFieldsArr;
  }
  buildLoanObj(): ILoan {
    return {
      productId: this.loanDetails.product['id'],
      productName: this.loanDetails.product['name'],
      loanAmount: this.loanDetailForm.value.loanAmount,
      tenor: this.loanDetailForm.value.tenor,
      approvalStatus: false,
      isDisbursed: false,
      isLiquidated: false
      // id: this.loanDetails.product['id'],
      // tenantId: this.loanDetails.product['tenantId']
    };
  }

  paymentDone(ref: any) {
    const title = 'Payment successfull';
    console.log(this.title, ref);
    this.paystackResponse = ref;
    this.toastr.success(title, '', {
      closeButton: true,
      positionClass: 'toast-top-right'
    });
    this.onSaveLoanApplication();
  }

  paymentCancel() {
    const title = 'Validate your debt card to complete the application process';
    this.toastr.error(title, 'ERROR!', {
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }

  setRandomPaymentRef() {
    this.tRef = `${Math.random() * 10000000000000}`;
  }

  getBankList() {
    const banks$ = this.loansService.getPaystackBankList();
    banks$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res.status) {
            this.pBankList = res.data;
          } else {
            this.toastr.error(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          }
        },
        (err: any) => {
          log.error(err);
          this.toastr.error(err.message, 'ERROR!', {
            closeButton: true,
            positionClass: 'toast-top-right'
          });
        }
      );
  }

  initAccountForm(): void {
    this.accountForm = this.fb.group({
      bankCode: [null, Validators.required],
      accountNumber: [null, Validators.required]
    });
  }

  onSubmitAccountForm() {}

  calculateRepaymentTotal(event: any) {
    const principal = parseFloat(this.amountToBorrow);
    const interest = parseFloat(this.loanDetails.product['interestRate']);
    const tenor = parseFloat(event.target.value);
    const amountToPay = principal + (interest / 100) * principal * tenor;
    log.info(event.target.value);
    log.info((interest / 100) * principal);
    log.info(amountToPay);
    // return principal + ((interest / 100) * principal);NG
    this.borrowerMsg = `${this.formatCurrency(
      principal
    )} to pay back ${this.formatCurrency(amountToPay)} in
        ${tenor} ${this.RateType[this.loanDetails.product['rateType']]}`;
  }

  setPrincipal(event: any) {
    this.amountToBorrow = event.target.value;
  }

  formatCurrency(amount: any) {
    return formatCurrency(amount, 'en_NG', '₦', 'NGN', '');
  }

  setTenor(e: any) {
    // this.tenorInWords = this.rateType[0].value;
    this.tenorInWords = this.RateType[e];
  }

  bankAccountLookup(accountNumber: any) {
    this.isLoading = true;
    const lookUp$ = this.loansService.validateAccountNumber(
      accountNumber,
      this.accountForm.value.bankCode
    );
    lookUp$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.accountName = res.responseData.account_name;
            this.accountNumber = res.responseData.account_number;
            this.isValidAcc = true;
            if (this.loanDetails.product['isBVNRequired'] === false) {
              this.isValidBvn = true;
            }
            log.info(this.accountNumber);
            this.toastr.success(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          } else {
            this.isValidAcc = false;
            this.accValidationErr = res.message;
            this.toastr.error(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          }
        },
        (err: any) => {
          log.error(err);
          this.toastr.error(err.message, 'ERROR!', {
            closeButton: true,
            positionClass: 'toast-top-right'
          });
        }
      );
  }
  bvnLookup(bvn: any) {
    this.isLoading = true;
    const lookUp$ = this.loansService.validateBvnNumber(bvn);
    lookUp$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            log.info(res.responseData);
            if (
              this.accountName.includes(res.responseData.last_name) ||
              this.accountName.includes(res.responseData.first_name)
            ) {
              this.isValidBvn = true;
              this.userBvn = bvn;
              this.toastr.success(
                `Name on BVN matches name on bank account`,
                undefined,
                {
                  closeButton: true,
                  positionClass: 'toast-top-right'
                }
              );
            } else {
              this.isValidBvn = false;
              this.toastr.error(
                `Name on BVN completely different from
                        name on bank account, please check and re-apply`,
                undefined,
                {
                  closeButton: true,
                  positionClass: 'toast-top-right'
                }
              );
            }
          } else {
            this.isValidAcc = false;
            this.accValidationErr = res.message;
            this.toastr.error(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          }
        },
        (err: any) => {
          log.error(err);
          this.toastr.error(err.message, 'ERROR!', {
            closeButton: true,
            positionClass: 'toast-top-right'
          });
        }
      );
  }

  buildAccountDetailObj(): IAccountDetail {
    return {
      accountNumber: this.accountNumber,
      accountName: this.accountName,
      bvn: this.userBvn,
      bankCode: this.accountForm.value.bankCode,
      isPrimary: true,
      tenantId: this.loanDetails.product['tenantId']
    };
  }

  buildAuthorisationTransactionObj(): IAuthorisationTransaction {
    // message: "Approved"
    // reference: "6301561022375.624"
    // status: "success"
    // trans: "190754314"
    // transaction: "190754314"
    // trxref: "6301561022375.624"
    return {
      ...this.paystackResponse,
      amount: this.paystackAuthAmount
    };
  }
}
