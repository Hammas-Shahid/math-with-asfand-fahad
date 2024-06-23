import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatmapAnalysisComponent } from './heatmap-analysis.component';

describe('HeatmapAnalysisComponent', () => {
  let component: HeatmapAnalysisComponent;
  let fixture: ComponentFixture<HeatmapAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeatmapAnalysisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeatmapAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
