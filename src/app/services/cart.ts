import { Injectable, signal, computed } from '@angular/core';
import { Cart } from '../models/cart/cart.model';
import { CartItem } from '../models/cart/cart-item.model';
import { Money } from '../models/common/money.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly TAX_RATE = 0.07;

  readonly shippingMethod = signal<'standard' | 'express'>('standard');
  readonly cart = signal<Cart>(this.createEmptyCart());

  readonly itemCount = computed(() => this.cart().items.reduce((sum, item) => sum + item.quantity, 0));

  addItem(item: CartItem): void {
    this.cart.update((cart) => {
      const existing = cart.items.find((i) => i.productId === item.productId);
      const items = existing
        ? cart.items.map((i) => (i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i))
        : [...cart.items, item];
      return this.recalculate({ ...cart, items });
    });
  }

  removeItem(productId: string): void {
    this.cart.update((cart) => {
      const items = cart.items.filter((i) => i.productId !== productId);
      return this.recalculate({ ...cart, items });
    });
  }

  setQuantity(productId: string, quantity: number): void {
    if (quantity < 1) return;
    this.cart.update((cart) => {
      const items = cart.items.map((i) => (i.productId === productId ? { ...i, quantity } : i));
      return this.recalculate({ ...cart, items });
    });
  }

  clear(): void {
    this.cart.set(this.createEmptyCart());
  }

  setShippingMethod(method: 'standard' | 'express'): void {
    this.shippingMethod.set(method);
    this.cart.update((cart) => this.recalculate(cart));
  }

  applyDiscount(code: string): boolean {
    const validCodes: Record<string, number> = { SAVE10: 10, WELCOME5: 5 };
    const discount = validCodes[code.toUpperCase()];
    if (!discount) return false;

    this.cart.update((cart) => {
      const discountAmount: Money = {
        centAmount: Math.round(cart.subtotal.centAmount * (discount / 100)),
        currencyCode: cart.subtotal.currencyCode,
        fractionDigits: cart.subtotal.fractionDigits,
        type: 'centPrecision',
      };
      return this.recalculate({ ...cart, discountCode: code, discountAmount });
    });
    return true;
  }

  private recalculate(cart: Cart): Cart {
    const currency = cart.items[0]?.price.currencyCode ?? 'USD';
    const fractionDigits = cart.items[0]?.price.fractionDigits ?? 2;

    const subtotalCents = cart.items.reduce((sum, item) => sum + item.price.centAmount * item.quantity, 0);
    const discountCents = cart.discountAmount?.centAmount ?? 0;
    const taxCents = Math.round((subtotalCents - discountCents) * this.TAX_RATE);
    const shippingCents = this.shippingMethod() === 'express' ? 1500 : 0;

    const money = (centAmount: number): Money => ({
      centAmount,
      currencyCode: currency,
      fractionDigits,
      type: 'centPrecision',
    });

    return {
      ...cart,
      subtotal: money(subtotalCents),
      estimatedTax: money(taxCents),
      shippingCost: money(shippingCents),
      total: money(subtotalCents - discountCents + taxCents + shippingCents),
    };
  }

  private createEmptyCart(): Cart {
    const zero: Money = { centAmount: 0, currencyCode: 'USD', fractionDigits: 2, type: 'centPrecision' };
    return {
      id: crypto.randomUUID(),
      items: [],
      subtotal: zero,
      estimatedTax: zero,
      shippingCost: zero,
      total: zero,
    };
  }
}
