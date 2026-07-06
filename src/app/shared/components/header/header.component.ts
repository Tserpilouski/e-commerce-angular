import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { ProductSearchInput } from '@app/product-search-input/product-search-input.component';
import { CartService } from '@services/cart';

@Component({
  selector: 'ec-header',
  imports: [RouterLink, RouterLinkActive, MatIconModule, LogoComponent, ProductSearchInput],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private cartService = inject(CartService);

  readonly itemCount = this.cartService.itemCount;
}
