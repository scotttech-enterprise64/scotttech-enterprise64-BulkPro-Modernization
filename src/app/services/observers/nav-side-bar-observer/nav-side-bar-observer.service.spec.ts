import { TestBed } from '@angular/core/testing';

import { NavSideBarObserverService } from './nav-side-bar-observer.service';

describe('NavSideBarObserverService', () => {
  let service: NavSideBarObserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavSideBarObserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
