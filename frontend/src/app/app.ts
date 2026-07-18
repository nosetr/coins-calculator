import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableComponent } from './components/table/table.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

export enum CalculateType {
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
  isLoading = signal(false);
  
  private readonly amountState = signal<{ new: number | null; previous: number | null }>({
    new: null,
    previous: null
  });

  newAmount = computed(() => this.amountState().new);
  previousAmount = computed(() => this.amountState().previous);

  readonly calculateTypes = [
    { value: CalculateType.BACKEND, label: 'Backend' },
    { value: CalculateType.FRONTEND, label: 'Frontend' }
  ];

  form!: FormGroup;
  private readonly formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      newAmount: ['', [Validators.required, Validators.min(0)]],
      previousAmount: [{ value: this.previousAmount(), disabled: true }],
      calculateType: [this.calculateTypes[0].value],
    });
  }

  onSubmit() {
    if (this.form?.valid) {
      const newAmount = this.form.getRawValue().newAmount;

      if (newAmount !== this.newAmount()) {
        this.amountState.update(state => ({
          previous: state.new, 
          new: newAmount
        }));

        this.form.patchValue({
          previousAmount: this.previousAmount()
        });
      }

      console.log('Absendedaten:', this.form.getRawValue());
    }
  }
}
