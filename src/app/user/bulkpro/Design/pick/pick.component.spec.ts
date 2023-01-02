import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignPickComponent } from './pick.component';

describe('PickComponent', () => {
  let component: DesignPickComponent;
  let fixture: ComponentFixture<DesignPickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignPickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
