import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCountComponent } from './set-count.component';

describe('SetCountComponent', () => {
  let component: SetCountComponent;
  let fixture: ComponentFixture<SetCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
