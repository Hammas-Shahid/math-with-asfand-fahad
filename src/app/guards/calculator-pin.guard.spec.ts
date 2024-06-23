import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { calculatorPinGuard } from './calculator-pin.guard';

describe('calculatorPinGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => calculatorPinGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
