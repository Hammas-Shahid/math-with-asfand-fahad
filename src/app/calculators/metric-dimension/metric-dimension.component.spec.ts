import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricDimensionComponent } from './metric-dimension.component';

describe('MetricDimensionComponent', () => {
  let component: MetricDimensionComponent;
  let fixture: ComponentFixture<MetricDimensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MetricDimensionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MetricDimensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
