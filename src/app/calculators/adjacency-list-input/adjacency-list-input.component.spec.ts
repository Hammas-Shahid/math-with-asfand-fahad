import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjacencyListInputComponent } from './adjacency-list-input.component';

describe('AdjacencyListInputComponent', () => {
  let component: AdjacencyListInputComponent;
  let fixture: ComponentFixture<AdjacencyListInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdjacencyListInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdjacencyListInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
