import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlyMetricDimensionComponent } from './only-metric-dimension.component';

describe('OnlyMetricDimensionComponent', () => {
  let component: OnlyMetricDimensionComponent;
  let fixture: ComponentFixture<OnlyMetricDimensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnlyMetricDimensionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OnlyMetricDimensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
