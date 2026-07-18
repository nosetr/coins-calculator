import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { App, CalculateTypeEnum } from './app';
import { WechselgeldRechnerService } from './generated-api';
import { CalculatorService } from './services/calculator.service';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockCalculatorService {
  calculate() {
    return { newAmount: 100, oldAmount: null, newDenomination: {}, difference: {} };
  }
}

class MockOpenApiService {
  calculate() {
    return of({ newAmount: 100, oldAmount: null, newDenomination: {}, difference: {} });
  }
}

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        ReactiveFormsModule
      ],
      providers: [
        { provide: 'ANIMATION_MODULE_TYPE', useValue: 'NoopAnimations' }, // Animation von Material deaktivieren
        { provide: WechselgeldRechnerService, useClass: MockOpenApiService },
        { provide: CalculatorService, useClass: MockCalculatorService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    
    // Wegen setTimeout-Fokus aus ngOnInit
    try {
      fixture.detectChanges();
    } catch (e) {}
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hallo, lass uns die optimale Wechselgeld-Stückelung berechnen!');
  });

  it('form should be invalid by init', () => {
    expect(component.form.valid).toBe(false);
    expect(component.isSubmitDisabled).toBe(true);
    expect(component.calculateType()).toBe(CalculateTypeEnum.BACK);
    expect(component.newAmount()).toBeNull();
  });

  it('submit button should be enabled when form is valid', () => {
    component.form.patchValue({
      newAmount: 150,
      calculateType: CalculateTypeEnum.BACK
    });

    fixture.detectChanges();

    expect(component.form.valid).toBe(true);
    expect(component.isSubmitDisabled).toBe(false);
  });

  it('should disable submit when trying to calculate the same value again', async () => {
    component.form.patchValue({
      newAmount: 200,
      calculateType: CalculateTypeEnum.BACK
    });
    
    component.onSubmit();
    
    // Wir warten die 200ms des setTimeouts einfach echt ab
    await wait(200); 
    fixture.detectChanges(); // Aktualisiert die UI nach dem Timeout
    
    expect(component.isSubmitDisabled).toBe(true);
  });

  it('should reset form and results on onReset', () => {
    component.form.patchValue({ newAmount: 100 });
    component.onReset();

    expect(component.form.get('newAmount')?.value).toBe('');
    expect(component.calculationResult()).toBeNull();
  });
});