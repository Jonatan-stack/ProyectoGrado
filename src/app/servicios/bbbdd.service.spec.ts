import { TestBed } from '@angular/core/testing';

import { BbbddService } from './bbbdd.service';

describe('BbbddService', () => {
  let service: BbbddService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BbbddService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
