import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VectorCalculatorComponent } from './vector-calculator.component';

describe('VectorCalculatorComponent', () => {
  let component: VectorCalculatorComponent;
  let fixture: ComponentFixture<VectorCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VectorCalculatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VectorCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
