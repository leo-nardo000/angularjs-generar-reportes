import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarEmpresaComponent } from './modificar-empresa.component';

describe('ModificarEmpresaComponent', () => {
  let component: ModificarEmpresaComponent;
  let fixture: ComponentFixture<ModificarEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarEmpresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
