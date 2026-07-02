import { TestBed } from '@angular/core/testing';
import { HttpEvent, HttpEventType, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { spinnerInterceptor } from './spinner-interceptor';
import { Spinner } from '../services/spinner';

describe('spinnerInterceptor', () => {
  let spinnerService: Spinner;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([spinnerInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    spinnerService = TestBed.inject(Spinner);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should call show() when a request starts', () => {
    const showSpy = vi.spyOn(spinnerService, 'show');

    TestBed.inject(HttpClient).get('/test').subscribe();

    httpController.expectOne('/test');
    expect(showSpy).toHaveBeenCalledOnce();
  });

  it('should call hide() when a request completes successfully', () => {
    const hideSpy = vi.spyOn(spinnerService, 'hide');

    TestBed.inject(HttpClient).get('/test').subscribe();

    const req = httpController.expectOne('/test');
    expect(hideSpy).not.toHaveBeenCalled();

    req.flush({ ok: true });
    expect(hideSpy).toHaveBeenCalledOnce();
  });

  it('should call hide() when a request fails', () => {
    const hideSpy = vi.spyOn(spinnerService, 'hide');

    TestBed.inject(HttpClient).get('/test').subscribe({ error: () => {} });

    const req = httpController.expectOne('/test');
    req.flush('error', { status: 500, statusText: 'Server Error' });
    expect(hideSpy).toHaveBeenCalledOnce();
  });
});
