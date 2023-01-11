import { TestBed } from '@angular/core/testing';

import { GuardService } from './guard.guard';

describe('GuardService', () => {
  let guard: GuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
