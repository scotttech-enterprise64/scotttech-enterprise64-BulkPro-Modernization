import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMsgWindowComponent } from './custom-msg-window.component';

describe('CustomMsgWindowComponent', () => {
  let component: CustomMsgWindowComponent;
  let fixture: ComponentFixture<CustomMsgWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomMsgWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomMsgWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
