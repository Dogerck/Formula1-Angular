import { TestBed } from '@angular/core/testing';

import { NextRaceService } from './next-race.service';

describe('NextRaceService', () => {
  let service: NextRaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NextRaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
