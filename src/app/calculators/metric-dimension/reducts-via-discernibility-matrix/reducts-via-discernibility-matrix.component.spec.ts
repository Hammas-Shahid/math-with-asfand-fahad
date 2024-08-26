import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReductsViaDiscernibilityMatrixComponent } from './reducts-via-discernibility-matrix.component';

describe('ReductsViaDiscernibilityMatrixComponent', () => {
  let component: ReductsViaDiscernibilityMatrixComponent;
  let fixture: ComponentFixture<ReductsViaDiscernibilityMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReductsViaDiscernibilityMatrixComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReductsViaDiscernibilityMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
