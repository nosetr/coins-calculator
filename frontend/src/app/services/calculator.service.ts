import { Injectable } from '@angular/core';
import { ResponseDto } from '../generated-api';
import { EuroDenominationEnum } from '../shared/enums';

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