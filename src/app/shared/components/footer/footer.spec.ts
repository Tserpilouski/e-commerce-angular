import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    nativeEl = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo with correct text', () => {
    const logoText = nativeEl.querySelector('.footer__logo-text');
    expect(logoText?.textContent?.trim()).toBe('RS Ecom');
  });

  it('should render the tagline', () => {
    const tagline = nativeEl.querySelector('.footer__tagline');
    expect(tagline?.textContent?.trim()).toBe('Premium tech gear for developers and gamers.');
  });

  it('should render all 3 link column titles', () => {
    const titles = nativeEl.querySelectorAll('.footer__col-title');
    const labels = Array.from(titles).map((t) => t.textContent?.trim());
    expect(labels).toEqual(['Shop', 'Support', 'Company']);
  });

  it('should render newsletter email input and subscribe button', () => {
    expect(nativeEl.querySelector('.footer__newsletter-input')).toBeTruthy();
    expect(nativeEl.querySelector('.footer__newsletter-btn')).toBeTruthy();
  });

  it('should render all payment badges', () => {
    const badges = nativeEl.querySelectorAll('.footer__payment-badge');
    const labels = Array.from(badges).map((b) => b.textContent?.trim());
    expect(labels).toEqual(['VISA', 'MC', 'PAY', 'PAYPAL']);
  });

  it('should clear email after subscribe when email is set', () => {
    component.email.set('test@example.com');
    component.onSubscribe();
    expect(component.email()).toBe('');
  });

  it('should not clear email on subscribe when email is empty', () => {
    component.email.set('');
    component.onSubscribe();
    expect(component.email()).toBe('');
  });

  it('should render copyright text', () => {
    const copy = nativeEl.querySelector('.footer__copy');
    expect(copy?.textContent).toContain('2026 RS Ecom');
  });
});
