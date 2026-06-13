import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { vi } from 'vitest';
import { Home } from './home';
import { ProductService } from '@services/product.service';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  const productServiceMock: {
    fetchProducts: ReturnType<typeof vi.fn>;
    products: WritableSignal<unknown[]>;
    loading: WritableSignal<boolean>;
  } = {
    fetchProducts: vi.fn(),
    products: signal([]),
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
