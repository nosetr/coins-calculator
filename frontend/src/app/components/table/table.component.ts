import { Component, input, computed } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import { CountFormatPipe } from '../../pipes/count-format.pipe';
import { ResponseDto } from '../../generated-api';

export interface TableItem {
  denomination: number;
  count: number;
}

export enum TableTypeEnum {
  NEW_DENOMINATION = 'NEW_DENOMINATION',
  DIFFERENCE = 'DIFFERENCE'
}

@Component({
  selector: 'app-table',
  imports: [
    CurrencyFormatPipe,
    MatTableModule,
    CountFormatPipe
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: true
})
export class TableComponent {
  type = input.required<TableTypeEnum>();
  result = input.required<ResponseDto | null>();

  columns = ['type', 'count'];

  tableTitle = computed(() => {
    return this.type() === TableTypeEnum.DIFFERENCE 
      ? 'Differenz zu ' + (this.result()?.oldAmount) + '€'
      : 'Neue Stückelung ' + (this.result()?.newAmount) + '€';
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
