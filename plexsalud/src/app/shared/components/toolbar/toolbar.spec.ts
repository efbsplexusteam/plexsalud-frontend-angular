import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { Toolbar } from './toolbar';
import { State } from '../../../modules/auth/services/state';
import { Auth } from '../../../modules/auth/services/auth';

describe('Toolbar', () => {
  let component: Toolbar;
  let fixture: ComponentFixture<Toolbar>;
  let mockState: State;
  let mockAuth: { refreshToken: ReturnType<typeof vi.fn>; logout: ReturnType<typeof vi.fn> };

  const mockDrawer = { toggle: vi.fn() };

  beforeEach(async () => {
    sessionStorage.clear();

    mockState = new State();
    mockAuth = {
      refreshToken: vi.fn().mockReturnValue(of({})),
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Toolbar],
      providers: [
        provideRouter([]),
        { provide: State, useValue: mockState },
        { provide: Auth, useValue: mockAuth },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Toolbar);
    component = fixture.componentInstance;
    component.matDrawerShow = mockDrawer as any;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize existToken and role from sessionStorage on init', () => {
    sessionStorage.setItem('role', 'DOCTOR');
    sessionStorage.setItem('access_token', 'test-token');

    fixture = TestBed.createComponent(Toolbar);
    component = fixture.componentInstance;
    component.matDrawerShow = mockDrawer as any;
    fixture.detectChanges();

    expect(mockState.existToken()).toBe(true);
    expect(mockState.role()).toBe('DOCTOR');
  });

  it('should call refreshToken when no sessionStorage values exist', () => {
    const refreshSpy = vi.fn().mockReturnValue(of({}));
    mockAuth.refreshToken = refreshSpy;

    fixture = TestBed.createComponent(Toolbar);
    component = fixture.componentInstance;
    component.matDrawerShow = mockDrawer as any;
    fixture.detectChanges();

    expect(refreshSpy).toHaveBeenCalledOnce();
  });

  it('should call authService.logout() on logout when user confirms', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.logout();

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockAuth.logout).toHaveBeenCalledOnce();
  });

  it('should NOT call authService.logout() on logout when user cancels', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.logout();

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockAuth.logout).not.toHaveBeenCalled();
  });

  it('should render login/register buttons when not logged in', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('mat-icon');
    const iconTexts = Array.from(icons).map((i) => i.textContent?.trim());
    expect(iconTexts).toContain('login');
    expect(iconTexts).toContain('person_add');
  });

  it('should render profile and logout buttons when logged in', () => {
    sessionStorage.setItem('role', 'PATIENT');
    sessionStorage.setItem('access_token', 'test-token');

    const newFixture = TestBed.createComponent(Toolbar);
    const newComponent = newFixture.componentInstance;
    newComponent.matDrawerShow = mockDrawer as any;
    newFixture.detectChanges();

    const compiled = newFixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('mat-icon');
    const iconTexts = Array.from(icons).map((i) => i.textContent?.trim());
    expect(iconTexts).toContain('person');
    expect(iconTexts).toContain('logout');
  });
});
