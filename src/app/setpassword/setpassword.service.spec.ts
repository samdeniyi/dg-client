import { TestBed } from '@angular/core/testing';

import { SetpasswordService } from './setpassword.service';

describe('SetpasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetpasswordService = TestBed.get(SetpasswordService);
    expect(service).toBeTruthy();
  });
});
