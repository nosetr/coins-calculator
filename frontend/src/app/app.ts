import { Component, signal, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TableComponent } from './components/table/table.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

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
  protected readonly title = 'Optimale Wechselgeld-Stückelung berechnen';
  readonly calculateTypes = [{ value: 'BACK', label: 'Backend' }, { value: 'FRONT', label: 'Frontend' }];

  form!: FormGroup;
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.form = this.fb.group({
      newAmount: ['', []],
      oldAmount: new FormControl('', []),
      calculateType: new FormControl(this.calculateTypes[0].value),
    });
  }

  onSubmit() {
    if (this.form?.valid) {
      console.log(this.form.value);
    }
  }
}
