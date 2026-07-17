import { TestBed } from '@angular/core/testing';

import { DenominationService } from './denomination.service';

describe('DenominationService', () => {
  let service: DenominationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DenominationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
