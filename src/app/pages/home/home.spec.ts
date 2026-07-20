import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { vi } from 'vitest';
import { Home } from './home';
import { ProductService } from '@services/product.service';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  const productServiceMock: {
    fetchPagedProducts: ReturnType<typeof vi.fn>;
    fetchCategories: ReturnType<typeof vi.fn>;
    products: WritableSignal<unknown[]>;
    categories: WritableSignal<unknown[]>;
    loading: WritableSignal<boolean>;
  } = {
    fetchPagedProducts: vi.fn(),
    fetchCategories: vi.fn(),
    products: signal([]),
    categories: signal([]),
    loading: signal(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [{ provide: ProductService, useValue: productServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
