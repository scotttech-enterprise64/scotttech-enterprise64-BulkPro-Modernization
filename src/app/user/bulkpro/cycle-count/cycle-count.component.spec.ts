import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleCountComponent } from './cycle-count.component';

describe('CycleCountComponent', () => {
  let component: CycleCountComponent;
  let fixture: ComponentFixture<CycleCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CycleCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
