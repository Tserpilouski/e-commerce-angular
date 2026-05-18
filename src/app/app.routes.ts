import { Routes } from '@angular/router';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';

export const routes: Routes = [{ path: 'product/:key', component: ProductDetailsComponent }];
