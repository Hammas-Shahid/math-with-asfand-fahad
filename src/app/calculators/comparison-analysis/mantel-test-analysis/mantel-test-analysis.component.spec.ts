import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantelTestAnalysisComponent } from './mantel-test-analysis.component';

describe('MantelTestAnalysisComponent', () => {
  let component: MantelTestAnalysisComponent;
  let fixture: ComponentFixture<MantelTestAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantelTestAnalysisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantelTestAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
