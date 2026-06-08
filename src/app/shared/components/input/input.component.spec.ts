import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('label', () => {
    it('should render mat-label when provided', async () => {
      fixture.componentRef.setInput('label', 'Email');
      await fixture.whenStable();

      const label = fixture.nativeElement.querySelector('mat-label');
      expect(label?.textContent?.trim()).toBe('Email');
    });

    it('should not render mat-label when empty', async () => {
      fixture.componentRef.setInput('label', '');
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('mat-label')).toBeNull();
    });
  });

  describe('type', () => {
    it('should default to text', async () => {
      await fixture.whenStable();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.type).toBe('text');
    });

    it('should set type to email', async () => {
      fixture.componentRef.setInput('type', 'email');
      await fixture.whenStable();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.type).toBe('email');
    });
  });

  describe('placeholder', () => {
    it('should set placeholder attribute', async () => {
      fixture.componentRef.setInput('placeholder', 'user@example.com');
      await fixture.whenStable();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.placeholder).toBe('user@example.com');
    });
  });

  describe('prefixIcon', () => {
    it('should render prefix icon when provided', async () => {
      fixture.componentRef.setInput('prefixIcon', 'mail');
      await fixture.whenStable();

      const icon = fixture.nativeElement.querySelector('mat-icon[matprefix]');
      expect(icon?.textContent?.trim()).toBe('mail');
    });

    it('should not render prefix icon when empty', async () => {
      fixture.componentRef.setInput('prefixIcon', '');
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('mat-icon[matprefix]')).toBeNull();
    });
  });

  describe('suffixIcon', () => {
    it('should render suffix icon when provided', async () => {
      fixture.componentRef.setInput('suffixIcon', 'visibility');
      await fixture.whenStable();

      const icon = fixture.nativeElement.querySelector('mat-icon[matsuffix]');
      expect(icon?.textContent?.trim()).toBe('visibility');
    });

    it('should not render suffix icon when empty', async () => {
      fixture.componentRef.setInput('suffixIcon', '');
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('mat-icon[matsuffix]')).toBeNull();
    });
  });

  describe('disabled state', () => {
    it('should disable native input when isDisabled is true', async () => {
      const localFixture = TestBed.createComponent(InputComponent);
      localFixture.componentInstance.isDisabled = true;
      localFixture.detectChanges();
      await localFixture.whenStable();

      const input = localFixture.nativeElement.querySelector('input');
      expect(input.disabled).toBe(true);
    });
  });
});
