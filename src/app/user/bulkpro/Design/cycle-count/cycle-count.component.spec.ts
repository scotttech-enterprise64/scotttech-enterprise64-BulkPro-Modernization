import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignCycleCountComponent } from './cycle-count.component';

describe('CycleCountComponent', () => {
  let component: DesignCycleCountComponent;
  let fixture: ComponentFixture<DesignCycleCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignCycleCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(DesignCycleCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
