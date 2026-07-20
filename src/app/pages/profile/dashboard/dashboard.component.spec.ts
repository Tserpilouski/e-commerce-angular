import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from '@services/auth.service';
import { CustomerService } from '@services/customer.service';
import { Address } from '@shared/models/address.model';

import { Dashboard } from './dashboard.component';

const ADDRESS: Address = { id: 'addr-1', country: 'US', city: 'San Francisco' };

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideHttpClient(),
        {
          provide: AuthService,
          useValue: {
            isAuthenticated: signal(true),
            currentUser: signal({ firstName: 'Alex', email: 'alex@example.com' }),
          },
        },
        {
          provide: CustomerService,
          useValue: {
            addresses: signal<Address[]>([ADDRESS]),
            defaultShippingAddressId: signal('addr-1'),
            loading: signal(false),
            error: signal<string | null>(null),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark the address matching defaultShippingAddressId', () => {
    expect(component.isDefault(ADDRESS)).toBe(true);
    expect(component.isDefault({ id: 'addr-2', country: 'US' })).toBe(false);
  });

  it('should not treat an unsaved address as default', () => {
    expect(component.isDefault({ country: 'US' })).toBe(false);
  });
});
