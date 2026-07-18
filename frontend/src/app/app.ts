import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableComponent, TableTypeEnum } from './components/table/table.component';
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
  BACK = 'Backend',
  FRONT = 'Frontend'
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
  private readonly amountState = signal<{ new: number | null; previous: number | null; calculateType: CalculateTypeEnum | null; }>({
    new: null,
    previous: null,
    calculateType: CalculateTypeEnum.BACK
  });
  calculationResult = signal<ResponseDto | null>(null);

  newAmount = computed(() => this.amountState().new);
  oldAmount = computed(() => this.amountState().previous);
  calculateType = computed(() => this.amountState().calculateType);

  readonly calculateTypes = [
    { value: CalculateTypeEnum.BACK, label: CalculateTypeEnum.BACK.valueOf() },
    { value: CalculateTypeEnum.FRONT, label: CalculateTypeEnum.FRONT.valueOf() }
  ];

  form!: FormGroup;
  private readonly formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      newAmount: ['', [Validators.required, Validators.min(0)]],
      oldAmount: [{ value: this.oldAmount(), disabled: true }],
      calculateType: [CalculateTypeEnum.BACK, Validators.required],
    });
    setTimeout(() => {
      (document.getElementById('newAmount') as HTMLInputElement | null)?.focus();
    });
    this.form.get('calculateType')?.valueChanges.subscribe(() => {
      this.calculationResult.set(null);
    });
  }

  get isSubmitDisabled(): boolean {
    if (this.isLoading() || !!this.form?.invalid) {
      return true;
    }

    const currentNewAmount = this.form.getRawValue().newAmount;
    const currentType = this.form.getRawValue().calculateType;

    const isSameAmount = currentNewAmount === this.newAmount();
    const isSameType = currentType === this.calculateType();

    return isSameAmount && isSameType;
  }

  onReset(): void {
    this.amountState.set({ new: null, previous: null, calculateType: CalculateTypeEnum.BACK });
    this.calculationResult.set(null);
    this.initForm();
  }

  onSubmit() {
    if (this.form?.valid) {
      const formValues = this.form.getRawValue();
      const newAmount = formValues.newAmount;

      if (newAmount === this.newAmount()) {
        return;
      }

      const calculateType = formValues.calculateType;

      this.isLoading.set(true);
      this.amountState.update(state => ({
        previous: state.new,
        new: newAmount,
        calculateType: calculateType
      }));

      this.form.patchValue({
        oldAmount: this.oldAmount()
      });

      if (calculateType === CalculateTypeEnum.BACK) {
        this.calculateOnBackend();
      } else if (calculateType === CalculateTypeEnum.FRONT) {
        this.calculateOnFrontend();
      }
    }
  }

  private calculateOnFrontend(): void {
    return;
  }

  private calculateOnBackend(): void {
    const request: RequestDto = {
      newAmount: this.newAmount()!,
      oldAmount: this.oldAmount() ?? undefined
    };

    this.openApiService.calculate(request)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response: ResponseDto) => {
          this.calculationResult.set(response);
          console.log('Calculation with success by backend:', response);
        },
        error: (err) => {
          console.error('Error by backend calculation:', err);
        }
      });
  }
}
