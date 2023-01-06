import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanOrdBatTotComponent } from './scan-ord-bat-tot.component';

describe('ScanOrdBatTotComponent', () => {
  let component: ScanOrdBatTotComponent;
  let fixture: ComponentFixture<ScanOrdBatTotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanOrdBatTotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanOrdBatTotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
