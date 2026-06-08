import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './shared/components/card/card.component';
import { Product } from './models/products/product.model';

@Component({
  selector: 'ec-product-galeria',
  imports: [CommonModule, CardComponent],
  templateUrl: 'galeria.html',
  styleUrl: 'galeria.css',
})
export class ProductGaleriaComponent {
  products = input.required<Product[]>();
  addToCard = output<Product>();
}
