import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanItemOrLocationComponent } from './scan-item-or-location.component';

describe('ScanItemOrLocationComponent', () => {
  let component: ScanItemOrLocationComponent;
  let fixture: ComponentFixture<ScanItemOrLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanItemOrLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanItemOrLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
