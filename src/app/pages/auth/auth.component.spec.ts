import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthComponent } from './auth.component';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthTab } from './model/auth-tab.enum';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let routerMock: Partial<Router>;
  let activatedRouteMock: Partial<ActivatedRoute>;

  beforeEach(async () => {
    routerMock = {
      navigate: vi.fn() as unknown as Router['navigate'],
    };

    activatedRouteMock = {
      url: of([{ path: 'login', parameters: {} } as UrlSegment]),
    };

    await TestBed.configureTestingModule({
      imports: [AuthComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in login mode by default', () => {
    expect(component.activeTab()).toBe(AuthTab.LOGIN);
  });

  it('should switch mode by navigating to the corresponding route', () => {
    component.handleTabChange('register');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should handle register success by setting email and switching to login', () => {
    component.handleRegisterSuccess('test@rsecom.com');
    expect(component.prefilledEmail()).toBe('test@rsecom.com');
    expect(routerMock.navigate).toHaveBeenCalledWith([`/${AuthTab.LOGIN}`]);
  });
});
