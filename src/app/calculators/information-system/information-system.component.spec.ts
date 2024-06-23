import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationSystemComponent } from './information-system.component';

describe('InformationSystemComponent', () => {
  let component: InformationSystemComponent;
  let fixture: ComponentFixture<InformationSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformationSystemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformationSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
