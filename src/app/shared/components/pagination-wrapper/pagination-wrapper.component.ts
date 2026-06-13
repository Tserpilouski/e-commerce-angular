import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PagedQueryResponse } from '@models/common/paged-query-response.model';
import { PaginationMode } from './models/pagination-mode.enum';

@Component({
  selector: 'ec-pagination-wrapper',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './pagination-wrapper.component.html',
  styleUrl: './pagination-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationWrapperComponent {
  readonly PaginationMode = PaginationMode;

  mode = input<PaginationMode>(PaginationMode.Numeric);
  response = input<PagedQueryResponse | null>(null);
  loading = input<boolean>(false);
  loadMoreLabel = input<string>('Load More Products');

  pageChange = output<{ limit: number; offset: number }>();
  loadMore = output<{ limit: number; offset: number }>();

  private readonly paginationState = computed(() => {
    const res = this.response();
    if (!res) {
      return { currentPage: 1, totalPages: 1, visiblePages: [] as (number | string)[] };
    }

    const { limit, offset, total } = res;
    const itemsLimit = limit || 1;
    const currentPage = Math.floor(offset / itemsLimit) + 1;
    const totalPages = total ? Math.ceil(total / itemsLimit) : 1;
    const visiblePages = this.generatePageRange(currentPage, totalPages);

    return { currentPage, totalPages, visiblePages };
  });

  currentPage = computed(() => this.paginationState().currentPage);
  totalPages = computed(() => this.paginationState().totalPages);
  visiblePages = computed(() => this.paginationState().visiblePages);

  private generatePageRange(current: number, total: number): (number | string)[] {
    const pages: (number | string)[] = [];
    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, '...', total);
      } else if (current >= total - 2) {
        pages.push(1, '...', total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current, '...', total);
      }
    }
    return pages;
  }

  onPageSelect(page: number | string): void {
    const res = this.response();
    if (typeof page === 'number' && page !== this.currentPage() && res) {
      const newOffset = (page - 1) * res.limit;
      this.pageChange.emit({ limit: res.limit, offset: newOffset });
    }
  }

  onPrevPage(): void {
    const res = this.response();
    const current = this.currentPage();
    if (current > 1 && res) {
      const newOffset = (current - 2) * res.limit;
      this.pageChange.emit({ limit: res.limit, offset: newOffset });
    }
  }

  onNextPage(): void {
    const res = this.response();
    const current = this.currentPage();
    const total = this.totalPages();
    if (current < total && res) {
      const newOffset = current * res.limit;
      this.pageChange.emit({ limit: res.limit, offset: newOffset });
    }
  }

  onLoadMoreClick(): void {
    const res = this.response();
    if (!this.loading() && res) {
      const nextOffset = res.offset + res.limit;
      this.loadMore.emit({ limit: res.limit, offset: nextOffset });
    }
  }
}
