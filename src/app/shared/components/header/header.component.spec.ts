import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    nativeEl = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo with correct text', () => {
    const logoText = nativeEl.querySelector('.header__logo-text');
    expect(logoText?.textContent?.trim()).toBe('RS Ecom');
  });

  it('should render 2 navigation links', () => {
    const links = nativeEl.querySelectorAll('.header__nav-link');
    expect(links.length).toBe(2);
  });

  it('should render correct navigation link labels', () => {
    const links = nativeEl.querySelectorAll('.header__nav-link');
    const labels = Array.from(links).map((l) => l.textContent?.trim());
    expect(labels).toEqual(['Shop', 'About Us']);
  });

  it('should render the cart icon button', () => {
    const cartBtn = nativeEl.querySelector('button[aria-label="Cart"]');
    expect(cartBtn).toBeTruthy();
  });

  it('should render the account link', () => {
    const accountLink = nativeEl.querySelector('a[aria-label="Account"]');
    expect(accountLink).toBeTruthy();
  });
});
