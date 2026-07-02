import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { Register } from './register';
import { Auth } from '../../services/auth';
import { Role } from '../../models/role';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let navigateSpy: any;
  let snackBarOpenSpy: any;

  const defaultRouteParams = of(convertToParamMap({ role: 'patient' }));
  const mockAuth = { register: vi.fn() };

  beforeEach(async () => {
    mockAuth.register.mockReset();
    snackBarOpenSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: mockAuth },
        { provide: MatSnackBar, useValue: { open: snackBarOpenSpy } },
        { provide: ActivatedRoute, useValue: { paramMap: defaultRouteParams } },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set rolePath and role form value from route params', () => {
      expect(component.rolePath).toBe('PATIENT');
      expect(component.registerForm.get('role')?.value).toBe('PATIENT');
    });

    it('should navigate to default role when route param is invalid', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [Register],
        providers: [
          provideRouter([]),
          { provide: Auth, useValue: mockAuth },
          { provide: MatSnackBar, useValue: { open: snackBarOpenSpy } },
          { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ role: 'invalid-role' })) } },
        ],
      });

      const router = TestBed.inject(Router);
      const spy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      const newFixture = TestBed.createComponent(Register);
      newFixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(['/auth/register/patient']);
    });
  });

  describe('register', () => {
    it('should call authService.register with form values and navigate on success', () => {
      mockAuth.register.mockReturnValue(of({}));
      component.rolePath = Role.PATIENT;

      component.registerForm.patchValue({
        email: 'test@test.com',
        password: '123456',
        confirmPassword: '123456',
        role: 'PATIENT',
      });
      component.register();

      expect(mockAuth.register).toHaveBeenCalledWith(component.registerForm.value);
      expect(navigateSpy).toHaveBeenCalledWith(['/auth/login/patient']);
    });

    it('should show snackbar on error', () => {
      mockAuth.register.mockReturnValue(throwError(() => 'Error message'));

      component.registerForm.patchValue({
        email: 'test@test.com',
        password: '123456',
        confirmPassword: '123456',
        role: 'PATIENT',
      });
      component.register();

      expect(snackBarOpenSpy).toHaveBeenCalledWith('Error message', 'Close', expect.any(Object));
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('resetRegisterForm', () => {
    it('should reset the form', () => {
      component.registerForm.patchValue({
        email: 'test@test.com',
        password: '123', confirmPassword: '123', role: 'PATIENT',
      });
      component.resetRegisterForm();
      expect(component.registerForm.value).toEqual({
        email: null, password: null, confirmPassword: null, role: null,
      });
    });
  });

  describe('passwordsMatchValidator', () => {
    it('should return null when passwords match', () => {
      component.registerForm.patchValue({ password: '123456', confirmPassword: '123456' });
      expect(component.registerForm.errors).toBeNull();
    });

    it('should return passwordsMismatch error when passwords differ', () => {
      component.registerForm.patchValue({ password: '123456', confirmPassword: '654321' });
      expect(component.registerForm.errors).toEqual({ passwordsMismatch: true });
    });
  });

  describe('showSnackBar', () => {
    it('should open snackbar with provided message', () => {
      component.showSnackBar('Test error');
      expect(snackBarOpenSpy).toHaveBeenCalledWith('Test error', 'Close', { duration: 3000 });
    });
  });
});
