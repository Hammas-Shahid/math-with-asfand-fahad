import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcaAnalysisComponent } from './pca-analysis.component';

describe('PcaAnalysisComponent', () => {
  let component: PcaAnalysisComponent;
  let fixture: ComponentFixture<PcaAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PcaAnalysisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PcaAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
