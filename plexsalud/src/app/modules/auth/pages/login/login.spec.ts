import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { Login } from './login';
import { Auth } from '../../services/auth';
import { State } from '../../services/state';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let navigateSpy: any;
  let snackBarOpenSpy: any;

  const defaultRouteParams = of(convertToParamMap({ role: 'patient' }));

  const mockAuth = { login: vi.fn() };

  beforeEach(async () => {
    mockAuth.login.mockReset();

    snackBarOpenSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        State,
        { provide: Auth, useValue: mockAuth },
        { provide: MatSnackBar, useValue: { open: snackBarOpenSpy } },
        { provide: ActivatedRoute, useValue: { paramMap: defaultRouteParams } },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set rolePath and role form value from route params', () => {
      expect(component.rolePath).toBe('PATIENT');
      expect(component.loginForm.get('role')?.value).toBe('PATIENT');
    });

    it('should navigate to default role when route param is invalid', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [Login],
        providers: [
          provideRouter([]),
          State,
          { provide: Auth, useValue: mockAuth },
          { provide: MatSnackBar, useValue: { open: snackBarOpenSpy } },
          { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ role: 'invalid-role' })) } },
        ],
      });

      const router = TestBed.inject(Router);
      const spy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      const newFixture = TestBed.createComponent(Login);
      newFixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(['/auth/login/patient']);
    });
  });

  describe('login', () => {
    it('should call authService.login with form values and navigate on success', () => {
      mockAuth.login.mockReturnValue(of({ role: 'PATIENT' }));

      component.loginForm.patchValue({ email: 'test@test.com', password: '123456', role: 'PATIENT' });
      component.login();

      expect(mockAuth.login).toHaveBeenCalledWith(component.loginForm.value);
      expect(navigateSpy).toHaveBeenCalledWith(['/patient/profile']);
    });

    it('should show snackbar on 401 error', () => {
      const showSnackBarSpy = vi.spyOn(component, 'showSnackBar');
      mockAuth.login.mockReturnValue(throwError(() => ({ status: 401 })));

      component.loginForm.patchValue({ email: 'test@test.com', password: 'wrong', role: 'PATIENT' });
      component.login();

      expect(showSnackBarSpy).toHaveBeenCalledWith('Bad credentials');
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should NOT navigate on non-401 error', () => {
      mockAuth.login.mockReturnValue(throwError(() => ({ status: 500 })));

      component.loginForm.patchValue({ email: 'test@test.com', password: '123456', role: 'PATIENT' });
      component.login();

      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('resetLoginForm', () => {
    it('should reset the form', () => {
      component.loginForm.patchValue({ email: 'test@test.com', password: '123', role: 'PATIENT' });
      component.resetLoginForm();
      expect(component.loginForm.value).toEqual({ email: null, password: null, role: null });
    });
  });


});
