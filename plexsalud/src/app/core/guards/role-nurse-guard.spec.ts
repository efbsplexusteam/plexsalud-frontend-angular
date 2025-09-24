import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { roleNurseGuard } from './role-nurse-guard';

describe('roleNurseGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roleNurseGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
