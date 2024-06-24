import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdsAnalysisComponent } from './mds-analysis.component';

describe('MdsAnalysisComponent', () => {
  let component: MdsAnalysisComponent;
  let fixture: ComponentFixture<MdsAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MdsAnalysisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MdsAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
