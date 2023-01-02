import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanLocationComponent } from './scan-location.component';

describe('ScanLocationComponent', () => {
  let component: ScanLocationComponent;
  let fixture: ComponentFixture<ScanLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
