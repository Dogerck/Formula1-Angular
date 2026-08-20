import { TestBed } from '@angular/core/testing';

import { MobileNavService } from './mobile-nav.service';

describe('MobileNavService', () => {
  let service: MobileNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobileNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts closed and toggles/closes', () => {
    expect(service.opened()).toBeFalse();

    service.toggle();
    expect(service.opened()).toBeTrue();

    service.toggle();
    expect(service.opened()).toBeFalse();

    service.toggle();
    service.close();
    expect(service.opened()).toBeFalse();
  });
});
