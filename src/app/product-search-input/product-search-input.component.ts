import { Component, inject, model } from '@angular/core';
import { InputComponent } from '@app/shared/components/input/input.component';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ec-product-search-input',
  imports: [InputComponent, FormsModule],
  templateUrl: './product-search-input.component.html',
})
export class ProductSearchInput {
  searchQuery = model<string>('');

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      const search = params['search'] || '';
      if (this.searchQuery() !== search) {
        this.searchQuery.set(search);
      }
    });
  }

  onSubmit() {
    const query = this.searchQuery().trim();
    this.router.navigate(['/product-list'], {
      queryParams: { search: query || null },
      queryParamsHandling: 'merge',
    });
  }
}
