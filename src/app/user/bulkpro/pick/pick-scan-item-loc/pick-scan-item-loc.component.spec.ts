import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickScanItemLocComponent } from './pick-scan-item-loc.component';

describe('PickScanItemLocComponent', () => {
  let component: PickScanItemLocComponent;
  let fixture: ComponentFixture<PickScanItemLocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickScanItemLocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickScanItemLocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
