import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricDimensionDialogComponent } from './metric-dimension-dialog.component';

describe('MetricDimensionDialogComponent', () => {
  let component: MetricDimensionDialogComponent;
  let fixture: ComponentFixture<MetricDimensionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MetricDimensionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MetricDimensionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
