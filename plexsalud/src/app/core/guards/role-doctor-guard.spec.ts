import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { roleDoctorGuard } from './role-doctor-guard';

describe('roleDoctorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roleDoctorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
