import { TestBed } from '@angular/core/testing';

import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calculation from newDenomination without oldAmount', () => {
    const result = service.calculate(75.00, null);

    expect(result.newAmount).toBe(75.00);
    expect(result.newDenomination).toEqual({
      '50.00': 1,
      '20.00': 1,
      '5.00': 1
    });
    expect(result.oldAmount).toBeUndefined();
    expect(result.difference).toBeUndefined();
  });

  it('should calculate amount with cents', () => {
    const result = service.calculate(5.23, null);

    expect(result.newDenomination).toEqual({
      '5.00': 1,
      '0.20': 1,
      '0.02': 1,
      '0.01': 1
    });
  });

  it('should calculate difference', () => {
    const result = service.calculate(150.00, 100.00);

    expect(result.oldAmount).toBe(100.00);
    expect(result.newAmount).toBe(150.00);
    expect(result.newDenomination).toEqual({
      '100.00': 1,
      '50.00': 1
    });
    expect(result.difference).toEqual({
      '100.00': 0,
      '50.00': 1
    });
  });

  it('should calculate negative difference', () => {
    const result = service.calculate(20.00, 50.00);

    expect(result.difference).toEqual({
      '50.00': -1,
      '20.00': 1
    });
  });
});
