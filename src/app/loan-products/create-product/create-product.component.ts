import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ILoanProduct,
  IProductDetail,
  IProductRequiredFields,
  LoanProductsService
} from '@app/loan-products/loan-products.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {Logger} from '@app/core/logger.service';
import {untilDestroyed} from '@app/core/until-destroyed';

const log = new Logger('Create product');

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit, OnDestroy {
  public activeTab = '';
  public title = 'Create Loan Product';
  public isLoading = false;
  public loanDetailObj: IProductDetail;
  public loanDetailForm: FormGroup;
  public createLoanProductObj: ILoanProduct;
  public showRequiredFields = false;
  public collepse = 'collapse0';
  public requiredFieldsArray = <any>[];
  public requiredFieldsObj: IProductRequiredFields;

  public breadcrumbItem: any = [
    {
      title: 'Loan Products',
      cssClass: ''
    },
    {
      title: 'Create loan product',
      cssClass: 'active'
    }
  ];
  constructor(
    public fb: FormBuilder,
    public productService: LoanProductsService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.getAllFormFiields();
  }

  ngOnInit() {
    this.createLoanDetailForm();
  }

  ngOnDestroy(): void {}

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

  createLoanDetailForm() {
    this.loanDetailForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      minLoanAmount: [null, [Validators.required]],
      maxLoanAmount: [null, [Validators.required]],
      minTenor: [null, [Validators.required]],
      maxTenor: [null, [Validators.required]],
      interestRate: [null, Validators.required],
      rateType: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.loanDetailForm.valid) {
      this.showRequiredFields = true;
      this.activeTab = 'requiredFields';
      log.info(this.loanDetailForm.value);
    } else {
      this.showRequiredFields = false;
      this.activeTab = 'loanDetails';
    }
  }

  toggleCollepseGeneral(collepse: string) {
    if (this.collepse !== collepse) {
      this.collepse = collepse;
    } else {
      this.collepse = '';
    }
  }

  getAllFormFiields() {
    const requiredFields$ = this.productService.getRequiredFormFields();
    requiredFields$
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.loanDetailForm.markAsPristine();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.requiredFieldsObj = res.responseData;
          } else {
            this.toastr.error(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          }
        },
        (err: any) => {
          log.info(err);
        }
      );
  }

  addFormField(event: any, val: any) {
    if (event.target.checked) {
      log.info('addFormField', val);
      this.requiredFieldsObj = {
        formFieldId: val.id,
        isRequired: true
      };
      this.requiredFieldsArray.push(this.requiredFieldsObj);
      log.info('requiredFieldsArray', this.requiredFieldsArray);
    }
  }

  buildCreateProductPayload() {
    return (this.createLoanProductObj = {
      product: this.loanDetailForm.value,
      productFormFields: this.requiredFieldsArray
    });
  }

  createProduct() {
    log.info('create product', this.buildCreateProductPayload());
    const createProduct$ = this.productService.createLoanProduct(this.buildCreateProductPayload());
    createProduct$
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
            this.toastr.success(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
            this.router.navigate(['/products/list']);
          } else {
            this.toastr.error(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          }
        },
        (err: any) => {
          log.info(err);
        }
      );
  }
}
