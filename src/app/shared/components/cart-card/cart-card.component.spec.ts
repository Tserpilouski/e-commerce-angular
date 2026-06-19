import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartCardComponent } from './cart-card.component';
import { CartItem } from '../../../models/cart/cart-item.model';

const mockItem: CartItem = {
  productId: '1',
  productKey: 'chrono-series-9',
  name: 'Chrono Series 9',
  variant: 'Starlight Aluminum | 41mm',
  quantity: 1,
  price: { centAmount: 39900, currencyCode: 'USD', fractionDigits: 2, type: 'centPrecision' },
};

describe('CartCardComponent', () => {
  let component: CartCardComponent;
  let fixture: ComponentFixture<CartCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartCardComponent);
    fixture.componentRef.setInput('item', mockItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
