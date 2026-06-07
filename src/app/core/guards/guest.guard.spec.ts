import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { guestGuard } from './guest.guard';
import { AuthService } from '../../services/auth.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('guestGuard', () => {
  let authServiceMock: { isAuthenticated: ReturnType<typeof vi.fn> };
  let routerMock: { createUrlTree: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: vi.fn().mockReturnValue(false),
    };

    routerMock = {
      createUrlTree: vi.fn().mockReturnValue({} as UrlTree),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should be created', () => {
    expect(guestGuard).toBeTruthy();
  });

  it('should allow navigation if user is not authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
    expect(result).toBe(true);
  });

  it('should redirect to home if user is authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    const mockUrlTree = { mockUrlTree: true } as unknown as UrlTree;
    routerMock.createUrlTree.mockReturnValue(mockUrlTree);

    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/']);
    expect(result).toBe(mockUrlTree);
  });
});
