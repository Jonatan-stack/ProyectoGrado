import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectClasesComponent } from './select-clases.component';

describe('SelectClasesComponent', () => {
  let component: SelectClasesComponent;
  let fixture: ComponentFixture<SelectClasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectClasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectClasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
