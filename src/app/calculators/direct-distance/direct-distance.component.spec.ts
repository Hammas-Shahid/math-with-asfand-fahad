import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectDistanceComponent } from './direct-distance.component';

describe('DirectDistanceComponent', () => {
  let component: DirectDistanceComponent;
  let fixture: ComponentFixture<DirectDistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectDistanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
