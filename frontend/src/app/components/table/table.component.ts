import { Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import { CountFormatPipe } from '../../pipes/count-format.pipe';

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
  tableTitle = input.required<string>();

  columns = ['type', 'count'];

  dataSource = [
    { denomination: 50, count: -2 },
    { denomination: 20, count: 1 },
    { denomination: 2, count: 3 }
  ];
}
