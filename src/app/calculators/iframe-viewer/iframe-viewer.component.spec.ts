import { ComponentFixture, TestBed } from '@angular/core/testing';

import { iframeViewerComponent } from './iframe-viewer.component';

describe('IframeViewerComponent', () => {
  let component: iframeViewerComponent;
  let fixture: ComponentFixture<iframeViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [iframeViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(iframeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
