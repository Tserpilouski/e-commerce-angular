import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationWrapperComponent } from './pagination-wrapper.component';

describe('PaginationWrapperComponent', () => {
  let component: PaginationWrapperComponent;
  let fixture: ComponentFixture<PaginationWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute pagination properties correctly on response change', () => {
    fixture.componentRef.setInput('response', {
      limit: 10,
      offset: 20,
      count: 10,
      total: 50,
    });
    fixture.detectChanges();

    expect(component.currentPage()).toBe(3);
    expect(component.totalPages()).toBe(5);
    expect(component.visiblePages()).toEqual([1, 2, 3, 4, 5]);
  });

  it('should format visible pages with ellipses for large page sets', () => {
    fixture.componentRef.setInput('response', {
      limit: 10,
      offset: 0,
      count: 10,
      total: 100, // 10 pages total
    });
    fixture.detectChanges();

    expect(component.currentPage()).toBe(1);
    expect(component.totalPages()).toBe(10);
    expect(component.visiblePages()).toEqual([1, 2, 3, '...', 10]);
  });

  it('should emit pageChange when onPageSelect is called with a new page number', () => {
    let emitted: { limit: number; offset: number } | undefined;
    component.pageChange.subscribe((val) => (emitted = val));

    fixture.componentRef.setInput('response', {
      limit: 10,
      offset: 10,
      count: 10,
      total: 30,
    });
    fixture.detectChanges();

    component.onPageSelect(3);

    expect(emitted).toEqual({ limit: 10, offset: 20 });
  });

  it('should emit loadMore when onLoadMoreClick is called', () => {
    let emitted: { limit: number; offset: number } | undefined;
    component.loadMore.subscribe((val) => (emitted = val));

    fixture.componentRef.setInput('response', {
      limit: 15,
      offset: 0,
      count: 15,
      total: 45,
    });
    fixture.detectChanges();

    component.onLoadMoreClick();

    expect(emitted).toEqual({ limit: 15, offset: 15 });
  });
});
