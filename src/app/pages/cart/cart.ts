import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { CartCardComponent } from '../../shared/components/cart-card/cart-card.component';
import { Button } from '../../button/button';
import { InputComponent } from '../../shared/components/input/input.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'ec-cart',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink, CartCardComponent, Button, InputComponent, ModalComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent {
  private cartService = inject(CartService);
  private router = inject(Router);

  readonly cart = this.cartService.cart;
  readonly itemCount = this.cartService.itemCount;
  readonly discountControl = new FormControl('');
  readonly discountError = signal<string>('');
  readonly discountSuccess = signal<boolean>(false);

  readonly pendingRemovalId = signal<string | null>(null);
  readonly pendingItem = computed(() => this.cart().items.find((i) => i.productId === this.pendingRemovalId()) ?? null);

  formatPrice(centAmount: number, fractionDigits: number): number {
    return centAmount / Math.pow(10, fractionDigits);
  }

  onQuantityChange(productId: string, quantity: number): void {
    this.cartService.setQuantity(productId, quantity);
  }

  onRemove(productId: string): void {
    this.pendingRemovalId.set(productId);
  }

  confirmRemove(): void {
    const id = this.pendingRemovalId();
    if (id) {
      this.cartService.removeItem(id);
    }
    this.pendingRemovalId.set(null);
  }

  cancelRemove(): void {
    this.pendingRemovalId.set(null);
  }

  applyDiscount(): void {
    const code = this.discountControl.value?.trim() ?? '';
    if (!code) return;

    const success = this.cartService.applyDiscount(code);
    if (success) {
      this.discountError.set('');
      this.discountSuccess.set(true);
    } else {
      this.discountError.set('Invalid discount code');
      this.discountSuccess.set(false);
    }
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
