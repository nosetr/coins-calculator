import { Component, input, computed, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import { CountFormatPipe } from '../../pipes/count-format.pipe';
import { ResponseDto } from '../../generated-api';

export interface TableItem {
  denomination: number;
  count: number;
}

export enum TableTypeEnum {
  NEW_DENOMINATION,
  DIFFERENCE
}

@Component({
  selector: 'app-table',
  imports: [
    CurrencyFormatPipe,
    MatTableModule,
    CountFormatPipe
  ],
  providers: [
    CurrencyFormatPipe
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: true
})
export class TableComponent {
  type = input.required<TableTypeEnum>();
  result = input.required<ResponseDto | null>();

  private readonly currencyFormatPipe = inject(CurrencyFormatPipe);

  columns = ['type', 'count'];

  tableTitle = computed(() => {
    const res = this.result();

    if (this.type() === TableTypeEnum.DIFFERENCE) {
      const formatted = res?.oldAmount !== undefined && res?.oldAmount !== null
        ? this.currencyFormatPipe.transform(res.oldAmount)
        : '';
      return `Differenz zu ${formatted}`;
    } else {
      const formatted = res?.newAmount !== undefined && res?.newAmount !== null
        ? this.currencyFormatPipe.transform(res.newAmount)
        : '';
      return `Neue Stückelung ${formatted}`;
    }
  });

  countHeader = computed(() => {
    return this.type() === TableTypeEnum.DIFFERENCE 
      ? 'Differenz' 
      : 'Anzahl';
  });

  dataSource = computed(() => {
    const result = this.type() === TableTypeEnum.DIFFERENCE
      ? this.result()?.difference
      : this.result()?.newDenomination;
    return this.buildArray(result);
  });

  private buildArray(result: { [key: string]: number } | undefined | null): TableItem[] {
    if (!result) return [];
    return Object.entries(result).map(([denomination, count]) => ({
      denomination: Number(denomination),
      count: count
    }));
  }
}
