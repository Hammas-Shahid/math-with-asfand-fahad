import { TestBed } from '@angular/core/testing';

import { CalculatorsService } from './calculators.service';

describe('CalculatorsService', () => {
  let service: CalculatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
