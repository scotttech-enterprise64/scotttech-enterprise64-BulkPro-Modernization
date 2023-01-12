import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickCusWinComponent } from './pick-cus-win.component';

describe('PickCusWinComponent', () => {
  let component: PickCusWinComponent;
  let fixture: ComponentFixture<PickCusWinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickCusWinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickCusWinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
