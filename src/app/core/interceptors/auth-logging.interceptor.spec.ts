import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';

import { authLoggingInterceptor } from './auth-logging.interceptor';
import { ToastService } from '@services/toast/toast.service';
import { ToastType } from '@shared/components/toast/models/toast.model';

describe('authLoggingInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let toastServiceMock: { show: ReturnType<typeof vi.fn> };
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    toastServiceMock = { show: vi.fn() };
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authLoggingInterceptor])),
        provideHttpClientTesting(),
        { provide: ToastService, useValue: toastServiceMock },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    consoleSpy.mockRestore();
  });

  it('should pass through a successful request without showing a toast', () => {
    http.get('/api/products').subscribe();
    const req = httpMock.expectOne('/api/products');
    req.flush({ results: [] });
    expect(toastServiceMock.show).not.toHaveBeenCalled();
  });

  it('should log the request method and URL to console', () => {
    http.get('/api/test').subscribe();
    const req = httpMock.expectOne('/api/test');
    req.flush({});
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('GET'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('/api/test'));
  });

  it('should show an error toast on a 404 response', () => {
    http.get('/api/missing').subscribe({ error: () => null });
    const req = httpMock.expectOne('/api/missing');
    req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
    expect(toastServiceMock.show).toHaveBeenCalledWith(ToastType.Error, expect.stringContaining('404'), 6000);
  });

  it('should show a network-error toast when status is 0', () => {
    http.get('/api/network').subscribe({ error: () => null });
    const req = httpMock.expectOne('/api/network');
    req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    expect(toastServiceMock.show).toHaveBeenCalledWith(ToastType.Error, expect.stringContaining('Network error'), 6000);
  });

  it('should show a server-error toast on a 500 response', () => {
    http.get('/api/broken').subscribe({ error: () => null });
    const req = httpMock.expectOne('/api/broken');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    expect(toastServiceMock.show).toHaveBeenCalledWith(ToastType.Error, expect.stringContaining('Server error'), 6000);
  });

  it('should re-throw the error after showing the toast', () => {
    let caught = false;
    http.get('/api/fail').subscribe({ error: () => (caught = true) });
    const req = httpMock.expectOne('/api/fail');
    req.flush({}, { status: 403, statusText: 'Forbidden' });
    expect(caught).toBe(true);
  });

  it('should show an unauthorised toast on a 401 response', () => {
    http.get('/api/protected').subscribe({ error: () => null });
    const req = httpMock.expectOne('/api/protected');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(toastServiceMock.show).toHaveBeenCalledWith(ToastType.Error, expect.stringContaining('Unauthorised'), 6000);
  });
});
