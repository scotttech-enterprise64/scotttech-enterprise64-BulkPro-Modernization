import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchCompletedComponent } from './batch-completed.component';

describe('BatchCompletedComponent', () => {
  let component: BatchCompletedComponent;
  let fixture: ComponentFixture<BatchCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchCompletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
