import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { CalculateTypeEnum } from '../../app';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('result', {
      newAmount: 100,
      oldAmount: null,
      newDenomination: {},
      difference: {}
    });

    fixture.componentRef.setInput('type', CalculateTypeEnum.BACK);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});