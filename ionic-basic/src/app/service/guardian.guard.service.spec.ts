import { TestBed } from '@angular/core/testing';

import { GuardianGuardService } from './guardian.guard.service';

describe('GuardianGuardService', () => {
  let service: GuardianGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuardianGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
