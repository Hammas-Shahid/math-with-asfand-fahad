import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllResolvingSetsComponent } from './all-resolving-sets.component';

describe('AllResolvingSetsComponent', () => {
  let component: AllResolvingSetsComponent;
  let fixture: ComponentFixture<AllResolvingSetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllResolvingSetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllResolvingSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
