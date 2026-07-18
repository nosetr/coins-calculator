import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  pure: false,
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number): string {
    const formattedAmount = value.toFixed(2).replace('.', ',');
      return `${formattedAmount} €`;
  }
}
