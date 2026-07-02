import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { roleNurseGuard } from './role-nurse-guard';
import { State } from '../../modules/auth/services/state';

describe('roleNurseGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => roleNurseGuard(...guardParameters));

  let mockState: State;
  let mockSnackBar: MatSnackBar;
  let mockRouter: Router;
  let navigateSpy: ReturnType<typeof vi.fn>;
  let snackBarOpenSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockState = new State();

    snackBarOpenSpy = vi.fn();
    mockSnackBar = { open: snackBarOpenSpy } as unknown as MatSnackBar;

    navigateSpy = vi.fn().mockResolvedValue(true);
    mockRouter = { navigate: navigateSpy } as unknown as Router;

    TestBed.configureTestingModule({
      providers: [
        { provide: State, useValue: mockState },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true when role is NURSE', () => {
    mockState.role.set('NURSE');

    expect(executeGuard({} as any, {} as any)).toBe(true);
    expect(snackBarOpenSpy).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should deny access when role is DOCTOR', async () => {
    mockState.role.set('DOCTOR');

    const result = executeGuard({} as any, {} as any);

    await expect(result).resolves.toBe(true);
    expect(snackBarOpenSpy).toHaveBeenCalledWith(
      'Unauthorized',
      'close',
      expect.objectContaining({ duration: 5000, verticalPosition: 'top' }),
    );
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  });

  it('should deny access when role is PATIENT', async () => {
    mockState.role.set('PATIENT');

    const result = executeGuard({} as any, {} as any);

    await expect(result).resolves.toBe(true);
    expect(snackBarOpenSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  });

  it('should deny access when role is empty', async () => {
    const result = executeGuard({} as any, {} as any);

    await expect(result).resolves.toBe(true);
    expect(snackBarOpenSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  });
});
