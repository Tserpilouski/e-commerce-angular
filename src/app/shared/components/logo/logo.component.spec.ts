import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoComponent } from './logo.component';
import { describe, it, expect, beforeEach } from 'vitest';

describe('LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render LogoComponent with default attributes', () => {
    fixture.detectChanges();
    const logoIcon = fixture.nativeElement.querySelector('.logo-icon');
    expect(logoIcon).toBeTruthy();
    expect(logoIcon.style.width).toBe('32px');
    expect(logoIcon.style.height).toBe('32px');
  });

  it('should reflect custom size and color inputs', () => {
    fixture.componentRef.setInput('size', 48);
    fixture.componentRef.setInput('color', '#ff0000');
    fixture.detectChanges();

    const logoIcon = fixture.nativeElement.querySelector('.logo-icon');
    expect(logoIcon.style.width).toBe('48px');
    expect(logoIcon.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });
});
