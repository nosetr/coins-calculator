import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { TableTypeEnum } from '../../shared/enums';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('type', TableTypeEnum.NEW_DENOMINATION);
    fixture.componentRef.setInput('result', null);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('tableTitle & countHeader', () => {
    it('should make settings for NEW_DENOMINATION type', () => {
      fixture.componentRef.setInput('type', TableTypeEnum.NEW_DENOMINATION);
      fixture.componentRef.setInput('result', {
        newAmount: 150,
        oldAmount: 100,
        newDenomination: {},
        difference: {}
      });
      fixture.detectChanges();

      expect(component.tableTitle()).toBe('Neue Stückelung 150,00 €');
      expect(component.countHeader()).toBe('Anzahl');
    });

    it('should make settings for DIFFERENCE type', () => {
      fixture.componentRef.setInput('type', TableTypeEnum.DIFFERENCE);
      fixture.componentRef.setInput('result', {
        newAmount: 150,
        oldAmount: 100,
        newDenomination: {},
        difference: {}
      });
      fixture.detectChanges();

      expect(component.tableTitle()).toBe('Differenz zu 100,00 €');
      expect(component.countHeader()).toBe('Differenz');
    });
  });

  describe('dataSource', () => {
    it('newDenomination object when type is NEW_DENOMINATION', () => {
      fixture.componentRef.setInput('type', TableTypeEnum.NEW_DENOMINATION);
      fixture.componentRef.setInput('result', {
        newAmount: 70,
        oldAmount: null,
        newDenomination: { '50': 1, '20': 1 },
        difference: {}
      });
      fixture.detectChanges();

      const expectedData = [
        { denomination: 20, count: 1 },
        { denomination: 50, count: 1 }
      ];

      expect(component.dataSource()).toEqual(expectedData);
    });

    it('difference object when type is DIFFERENCE', () => {
      fixture.componentRef.setInput('type', TableTypeEnum.DIFFERENCE);
      fixture.componentRef.setInput('result', {
        newAmount: 120,
        oldAmount: 100,
        newDenomination: {},
        difference: { '10': 2, '2': 0 }
      });
      fixture.detectChanges();

      const expectedData = [
        { denomination: 2, count: 0 },
        { denomination: 10, count: 2 }
      ];

      expect(component.dataSource()).toEqual(expectedData);
    });

    it('should return an empty array', () => {
      fixture.componentRef.setInput('type', TableTypeEnum.NEW_DENOMINATION);
      fixture.componentRef.setInput('result', null);
      fixture.detectChanges();

      expect(component.dataSource()).toEqual([]);
    });
  });
});