import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonAnalysisComponent } from './comparison-analysis.component';

describe('ComparisonAnalysisComponent', () => {
  let component: ComparisonAnalysisComponent;
  let fixture: ComponentFixture<ComparisonAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComparisonAnalysisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComparisonAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
