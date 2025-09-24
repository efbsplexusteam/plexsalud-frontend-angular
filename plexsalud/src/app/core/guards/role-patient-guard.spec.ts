import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { rolePatientGuard } from './role-patient-guard';

describe('rolePatientGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => rolePatientGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
