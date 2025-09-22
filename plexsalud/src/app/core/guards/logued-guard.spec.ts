import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loguedGuard } from './logued-guard';

describe('loguedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loguedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
