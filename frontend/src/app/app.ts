import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableComponent, TableItem, TableTypeEnum } from './components/table/table.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RequestDto, ResponseDto, WechselgeldRechnerService } from './generated-api';
import { finalize } from 'rxjs';

export enum CalculateTypeEnum {
  BACKEND = 'BACK',
  FRONTEND = 'FRONT'
}

@Component({
  selector: 'app-root',
  imports: [
    TableComponent,
    MatDividerModule,
    MatCardModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly TableTypeEnum = TableTypeEnum;
  private readonly openApiService = inject(WechselgeldRechnerService);

  isLoading = signal(false);
  private readonly amountState = signal<{ new: number | null; previous: number | null }>({
    new: null,
    previous: null
  });
  calculationResult = signal<ResponseDto | null>(null);

  newAmount = computed(() => this.amountState().new);
  oldAmount = computed(() => this.amountState().previous);

  // Array für die 'Neue Stückelung'
  newDenominationData = computed<TableItem[]>(() => {
    const result = this.calculationResult()?.newDenomination;
    return this.buildArray(result);
  });

  // Array für die 'Differenz'
  differenceData = computed<TableItem[]>(() => {
    const result = this.calculationResult()?.difference;
    return this.buildArray(result);
  });

  private buildArray(result: { [key: string]: number } | undefined | null): TableItem[] {
    if (!result) return [];
    return Object.entries(result).map(([denomination, count]) => ({
      denomination: Number(denomination),
      count: count
    }));
  }

  readonly calculateTypes = [
    { value: CalculateTypeEnum.BACKEND, label: 'Backend' },
    { value: CalculateTypeEnum.FRONTEND, label: 'Frontend' }
  ];

  form!: FormGroup;
  private readonly formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      newAmount: ['', [Validators.required, Validators.min(0)]],
      oldAmount: [{ value: this.oldAmount(), disabled: true }],
      calculateType: [CalculateTypeEnum.BACKEND, Validators.required],
    });
  }

  onSubmit() {
    if (this.form?.valid) {
      const newAmount = this.form.getRawValue().newAmount;

      if (newAmount === this.newAmount()) {
        return;
      }

      this.isLoading.set(true);
      this.amountState.update(state => ({
        previous: state.new,
        new: newAmount
      }));

      this.form.patchValue({
        oldAmount: this.oldAmount()
      });

      const request: RequestDto = {
        newAmount: newAmount,
        oldAmount: this.form.getRawValue().oldAmount
      };

      this.openApiService.calculate(request)
        .pipe(
          finalize(() => this.isLoading.set(false))
        )
        .subscribe({
          next: (response: ResponseDto) => {
            this.calculationResult.set(response);
            console.log('Calculation with success:', response);
          },
          error: (err) => {
            console.error('Error by calculation:', err);
          }
        });
    }
  }
}
