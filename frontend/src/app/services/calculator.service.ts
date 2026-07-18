import { Injectable } from '@angular/core';
import { ResponseDto } from '../generated-api';

export enum EuroDenominationEnum {
  EUR_200 = '200.00',
  EUR_100 = '100.00',
  EUR_50 = '50.00',
  EUR_20 = '20.00',
  EUR_10 = '10.00',
  EUR_5 = '5.00',
  EUR_2 = '2.00',
  EUR_1 = '1.00',
  EURO_0_50 = '0.50',
  EURO_0_20 = '0.20',
  EURO_0_10 = '0.10',
  EURO_0_05 = '0.05',
  EURO_0_02 = '0.02',
  EURO_0_01 = '0.01'
}

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  public calculate(newAmount: number, oldAmount: number | null): ResponseDto {
    
    const hasOldAmount = oldAmount !== null && oldAmount > 0;

    const newAmountMap = this.buildMap(newAmount);
    const oldAmountMap = hasOldAmount ? this.buildMap(oldAmount!) : new Map<string, number>();

    const newDenominationsMap: { [key: string]: number } = {};
    const differenceMap: { [key: string]: number } = {};

    for (const denomination of Object.values(EuroDenominationEnum)) {
      const key = denomination.toString();

      const newCount = newAmountMap.get(key) ?? 0;
      if (newCount > 0) {
        newDenominationsMap[key] = newCount;
      }

      if (hasOldAmount) {
        const oldCount = oldAmountMap.get(key) ?? 0;
        const diff = newCount - oldCount;
        if (diff !== 0 || newCount > 0) {
          differenceMap[key] = diff;
        }
      }
    }

    return {
      newAmount: newAmount,
      oldAmount: oldAmount ?? undefined,
      newDenomination: newDenominationsMap,
      difference: hasOldAmount ? differenceMap : undefined
    };
  }

  /**
   * Berechnet Stückelungen
   */
  private buildMap(amount: number): Map<string, number> {
    // in Cent umrechnen
    let restInCent = Math.round(amount * 100);
    const map = new Map<string, number>();

    for (const euroDenominationEnum of Object.values(EuroDenominationEnum)) {
      if (restInCent <= 0) {
        break;
      }
 
      // in Cent umrechnen
      const denominationInCent = Math.round(Number.parseFloat(euroDenominationEnum) * 100);

      // Ähnlich zu Java's divideAndRemainder [0]
      const index = Math.floor(restInCent / denominationInCent);
      
      if (index > 0) {
        map.set(euroDenominationEnum, index);
        restInCent = restInCent % denominationInCent;
      }
    }

    return map;
  }
}