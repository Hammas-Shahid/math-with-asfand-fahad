import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAdjacencyMatrixComponent } from './get-adjacency-matrix.component';

describe('GetAdjacencyMatrixComponent', () => {
  let component: GetAdjacencyMatrixComponent;
  let fixture: ComponentFixture<GetAdjacencyMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GetAdjacencyMatrixComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetAdjacencyMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
