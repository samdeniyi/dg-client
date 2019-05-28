import { TestBed } from '@angular/core/testing';

import { LoanProductsService } from './loan-products.service';

describe('LoanProductsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoanProductsService = TestBed.get(LoanProductsService);
    expect(service).toBeTruthy();
  });
});
