import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleGastoPage } from './detalle-gasto.page';

describe('DetalleGastoPage', () => {
  let component: DetalleGastoPage;
  let fixture: ComponentFixture<DetalleGastoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleGastoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
