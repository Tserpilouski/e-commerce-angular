import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSpecificationsComponent } from './product-specifications.component';
import { ComponentRef } from '@angular/core';

describe('ProductSpecificationsComponent', () => {
  let component: ProductSpecificationsComponent;
  let fixture: ComponentFixture<ProductSpecificationsComponent>;
  let componentRef: ComponentRef<ProductSpecificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSpecificationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSpecificationsComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty when no inputs provided', () => {
    const rows = fixture.nativeElement.querySelectorAll('.spec-card__row');
    expect(rows.length).toBe(0);
  });

  it('should render custom specifications when provided', () => {
    componentRef.setInput('customSpecs', [
      { label: 'Battery', value: '100 Wh' },
      { label: 'Weight', value: '2.1 kg' },
    ]);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.spec-card__row');
    expect(rows.length).toBe(2);
    expect(rows[0].querySelector('.spec-card__label')?.textContent).toContain('Battery');
    expect(rows[0].querySelector('.spec-card__value')?.textContent).toContain('100 Wh');
  });

  it('should render attributes using label or name when provided', () => {
    componentRef.setInput('attributes', [
      { name: 'screen_res', label: 'Screen Resolution', value: '3456 x 2234' },
      { name: 'raw_key', value: 'Raw Value' },
      { name: 'color', label: 'Color', value: 'Blue' },
    ]);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.spec-card__row');
    expect(rows.length).toBe(3);
    expect(rows[0].querySelector('.spec-card__label')?.textContent).toContain('Screen Resolution');
    expect(rows[0].querySelector('.spec-card__value')?.textContent).toContain('3456 x 2234');
    expect(rows[1].querySelector('.spec-card__label')?.textContent).toContain('raw_key');
    expect(rows[1].querySelector('.spec-card__value')?.textContent).toContain('Raw Value');
    expect(rows[2].querySelector('.spec-card__label')?.textContent).toContain('Color');
    expect(rows[2].querySelector('.spec-card__value')?.textContent).toContain('Blue');
  });
});
