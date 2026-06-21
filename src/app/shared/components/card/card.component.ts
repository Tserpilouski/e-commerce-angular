import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '@models/products/product.model';
import { ProductImagePipe } from '@shared/pipes/product-image.pipe';
import { RouterLink } from '@angular/router';
import { ToastService } from '@app/services/toast/toast.service';
import { ToastType } from '@shared/components/toast/models/toast.model';
@Component({
  selector: 'ec-card',
  imports: [CommonModule, ProductImagePipe, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  private toastService = inject(ToastService);
  product = input.required<Product>();
  addToCart = output<Product>();

  onAddToCart() {
    this.addToCart.emit(this.product());
    this.toastService.show(ToastType.Success, this.product().name['en'] ?? '', 2000);
  }
}
