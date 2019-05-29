import {Component, OnDestroy, OnInit} from '@angular/core';
import {ICreateLoan, ILoan, ILoanFormFields, LoansService} from '@app/loans/loans.service';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {untilDestroyed} from '@app/core/until-destroyed';
import {Logger} from '@app/core/logger.service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

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
  product: any;
  activeTab = '';
  showRequiredFields = false;
  createLoanObj: ICreateLoan;
  loanDetailForm: FormGroup;
  requiredFieldForm: FormGroup;


  public title = 'Apply for Loans';
  public breadcrumbItem: any ;

  constructor(private loansService: LoansService, private router: Router, private route:  ActivatedRoute,
              private toastr: ToastrService, private fb: FormBuilder) { }

  ngOnInit() {
    this.selLoanId = this.route.snapshot.paramMap.get('id');
    if (!this.selLoanId) {
      this.router.navigate(['/loans/view']);
    } else {
      this.getLoanDetails(this.selLoanId);
      this.initCreateLoanForm();
    }
  }

  ngOnDestroy(): void {
  }

  getLoanDetails(id: any) {
    log.info(id);
    this.isLoading = true;
    const getProductDetail = this.loansService.getProductById(id);
    getProductDetail.pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
    ).subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.loanDetails = res.responseData;
            this.initRequiredFieldForm();
            log.info(this.loanDetails);
            this.title = `Apply for Loans (${this.loanDetails.product['name']})`;
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
            } else {
                this.showRequiredFields = true;
            }
        }
    }

    initCreateLoanForm(): void{
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
      if(this.loanDetailForm.valid) {
          this.tabChange('requiredFields');
      }
    }

    onBlurRequiredField(event: any, obj: any, i: any) {
      this.loanDetails.productFormFields[i].fieldValue = event.target.value;
    }

    onSubmitRequiredField() {
      if (this.requiredFieldForm.valid) {
          this.isLoading = true;
          const payload: ICreateLoan = {
              loan: this.buildLoanObj(),
              loanFormFields: this.buildRequiredFieldObj()
          };
          const createLoan = this.loansService.loanApplication(payload);
          createLoan.pipe(
              finalize(() => {
                  this.isLoading = false;
              }),
              untilDestroyed(this)
          ).subscribe(
              (res: any) => {
                  if (res.responseCode === '00') {
                        log.info(res.responseData);
                  } else {
                      this.toastr.error(res.message, undefined, {
                          closeButton: true,
                          positionClass: 'toast-top-right'
                      });
                  }
              },
              (err: any) => {
                  log.error(err);
                  this.toastr.error(err.message, 'ERROR!',{
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
            loanFormFieldsArr.push(
                {
                    formFieldId: m.formFieldId,
                    formFieldName: m.formFieldName,
                    formFieldValue: m.fieldValue,
                    tenantId: m.tenantId
                }
            );
        }
      return loanFormFieldsArr;
    }
    buildLoanObj(): ILoan {
      return {
          productName: this.loanDetails.product['name'],
        loanAmount: this.loanDetailForm.value.loanAmount,
        loanType: 1,
        tenor: this.loanDetailForm.value.tenor,
        approvalStatus: false,
        isDisbursed: false,
        isLiquidated: false,
        id: this.loanDetails.product['id'],
        tenantId: this.loanDetails.product['tenantId']
      };
    }

}
