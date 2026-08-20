import { TestBed } from '@angular/core/testing';

import { LoaderService } from './loader-service.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts hidden and toggles with show()/hide()', () => {
    expect(service.loading()).toBeFalse();

    service.show();
    expect(service.loading()).toBeTrue();

    service.hide();
    expect(service.loading()).toBeFalse();
  });
});
