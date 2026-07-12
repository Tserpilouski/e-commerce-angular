import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the spinner component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the spinner element', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.loading-spinner__icon')).toBeTruthy();
  });

  it('should not render a label when no label input is provided', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.loading-spinner__label')).toBeNull();
  });

  it('should render a label when the label input is set', async () => {
    fixture.componentRef.setInput('label', 'Loading products…');
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.loading-spinner__label')?.textContent?.trim()).toBe('Loading products…');
  });

  it('should have role="status" on the wrapper for accessibility', () => {
    const el: HTMLElement = fixture.nativeElement;
    const wrapper = el.querySelector('.loading-spinner');
    expect(wrapper?.getAttribute('role')).toBe('status');
  });
});
