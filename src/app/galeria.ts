import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, Product } from './card';

@Component({
  selector: 'app-product-galeria',
  imports: [CommonModule, CardComponent],
  templateUrl: 'galeria.html',
  styleUrl: 'galeria.css',
})
export class ProductGaleriaComponent {
  products = input.required<Product[]>();
  addToCard = output<Product>();
}
