import { Component, input, computed } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import { CountFormatPipe } from '../../pipes/count-format.pipe';

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
  dataSource = input.required<TableItem[]>();
  type = input.required<TableTypeEnum>();

  columns = ['type', 'count'];

  tableTitle = computed(() => {
    return this.type() === TableTypeEnum.DIFFERENCE 
      ? 'Differenz zu' 
      : 'Neue Stückelung';
  });

  countHeader = computed(() => {
    return this.type() === TableTypeEnum.DIFFERENCE 
      ? 'Differenz' 
      : 'Anzahl';
  });
}
