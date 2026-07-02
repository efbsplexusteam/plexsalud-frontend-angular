import { TestBed } from '@angular/core/testing';
import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { jwtInterceptor } from './jwt-interceptor';
import { Auth } from '../../modules/auth/services/auth';

describe('jwtInterceptor', () => {
  let httpController: HttpTestingController;
  let mockAuth: { refreshToken: ReturnType<typeof vi.fn>; logout: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    sessionStorage.clear();

    mockAuth = {
      refreshToken: vi.fn(),
      logout: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
        { provide: Auth, useValue: mockAuth },
      ],
    });

    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    sessionStorage.clear();
    httpController.verify();
  });

  it('should add Authorization Bearer header from sessionStorage', () => {
    sessionStorage.setItem('access_token', 'my-token');

    TestBed.inject(HttpClient).get('/api/data').subscribe();

    const req = httpController.expectOne('/api/data');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-token');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('should use empty Bearer token when no access_token in sessionStorage', () => {
    TestBed.inject(HttpClient).get('/api/data').subscribe();

    const req = httpController.expectOne('/api/data');
    expect(req.request.headers.get('Authorization')).toBe('Bearer ');
    req.flush({});
  });

  it('should pass through non-401 errors', () => {
    TestBed.inject(HttpClient).get('/api/data').subscribe({ error: () => {} });

    const req = httpController.expectOne('/api/data');
    req.flush('error', { status: 500, statusText: 'Server Error' });

    expect(mockAuth.refreshToken).not.toHaveBeenCalled();
    expect(mockAuth.logout).not.toHaveBeenCalled();
  });

  it('should call refreshToken on 401 and retry request on success', () => {
    sessionStorage.setItem('access_token', 'expired-token');
    mockAuth.refreshToken.mockReturnValue(of({ accessToken: 'new-token' }));

    TestBed.inject(HttpClient).get('/api/data').subscribe();

    const req = httpController.expectOne('/api/data');
    expect(req.request.headers.get('Authorization')).toBe('Bearer expired-token');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(mockAuth.refreshToken).toHaveBeenCalledOnce();

    const retryReq = httpController.expectOne('/api/data');
    expect(retryReq.request.headers.get('Authorization')).toBe('Bearer new-token');
    retryReq.flush({ ok: true });
  });

  it('should call logout on 401 when refreshToken fails', () => {
    sessionStorage.setItem('access_token', 'expired-token');
    mockAuth.refreshToken.mockReturnValue(throwError(() => new Error('refresh failed')));

    TestBed.inject(HttpClient).get('/api/data').subscribe({ error: () => {} });

    const req = httpController.expectOne('/api/data');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(mockAuth.refreshToken).toHaveBeenCalledOnce();
    expect(mockAuth.logout).toHaveBeenCalledOnce();
  });

  it('should NOT intercept 401 on /auth/refresh endpoint', () => {
    TestBed.inject(HttpClient).get('/auth/refresh').subscribe({ error: () => {} });

    const req = httpController.expectOne('/auth/refresh');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(mockAuth.refreshToken).not.toHaveBeenCalled();
    expect(mockAuth.logout).not.toHaveBeenCalled();
  });

  it('should NOT intercept 401 on /auth/login endpoint', () => {
    TestBed.inject(HttpClient).get('/auth/login').subscribe({ error: () => {} });

    const req = httpController.expectOne('/auth/login');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(mockAuth.refreshToken).not.toHaveBeenCalled();
    expect(mockAuth.logout).not.toHaveBeenCalled();
  });

  it('should NOT intercept 401 on /auth/logout endpoint', () => {
    TestBed.inject(HttpClient).get('/auth/logout').subscribe({ error: () => {} });

    const req = httpController.expectOne('/auth/logout');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(mockAuth.refreshToken).not.toHaveBeenCalled();
    expect(mockAuth.logout).not.toHaveBeenCalled();
  });
});
