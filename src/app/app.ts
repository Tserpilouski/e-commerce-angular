import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Product } from './card';
import { ProductGaleriaComponent } from './galeria';
import { Button } from './button/button';
import { Input } from './shared/components/input/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'ec-root',
  imports: [RouterOutlet, ProductGaleriaComponent, Button, Input, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.email]),
  });

  products: Product[] = [
    {
      id: 1,
      name: 'Alienware m16',
      description: '32GB RAM • 1TB NVMe',
      price: 1899.99,
      image: 'https://placehold.co/400x300',
      badge: 'NEW RELEASE',
    },
    {
      id: 2,
      name: 'Razer Blade 16',
      description: '32GB RAM • 2TB NVMe',
      price: 3299.99,
      image: 'https://placehold.co/400x300',
    },
    {
      id: 3,
      name: 'ASUS Zephyrus G14',
      description: '16GB RAM • 1TB SSD',
      price: 1599.99,
      image: 'https://placehold.co/400x300',
      badge: 'BEST SELLER',
    },
    {
      id: 4,
      name: 'Lenovo Legion Pro 7i',
      description: '32GB RAM • 1TB SSD',
      price: 2449.99,
      image: 'https://placehold.co/400x300',
    },
  ];

  onAddToCard(products: Product) {
    console.log('added to card', products);
  }
}
