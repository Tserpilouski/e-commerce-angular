import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
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

  it('should render 5 navigation links', () => {
    const links = nativeEl.querySelectorAll('.header__nav-link');
    expect(links.length).toBe(5);
  });

  it('should render correct navigation link labels', () => {
    const links = nativeEl.querySelectorAll('.header__nav-link');
    const labels = Array.from(links).map((l) => l.textContent?.trim());
    expect(labels).toEqual(['Shop', 'Tech', 'New Drops', 'Support', 'About Us']);
  });

  it('should render the cart icon button', () => {
    const cartBtn = nativeEl.querySelector('button[aria-label="Cart"]');
    expect(cartBtn).toBeTruthy();
  });

  it('should render the account icon button', () => {
    const accountBtn = nativeEl.querySelector('button[aria-label="Account"]');
    expect(accountBtn).toBeTruthy();
  });
});
