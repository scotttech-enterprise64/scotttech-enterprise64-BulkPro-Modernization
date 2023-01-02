import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkproComponent } from './bulkpro.component';

describe('BulkproComponent', () => {
  let component: BulkproComponent;
  let fixture: ComponentFixture<BulkproComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkproComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
