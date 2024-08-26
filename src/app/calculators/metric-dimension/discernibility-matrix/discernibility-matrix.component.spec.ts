import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscernibilityMatrixComponent } from './discernibility-matrix.component';

describe('DiscernibilityMatrixComponent', () => {
  let component: DiscernibilityMatrixComponent;
  let fixture: ComponentFixture<DiscernibilityMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscernibilityMatrixComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiscernibilityMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
