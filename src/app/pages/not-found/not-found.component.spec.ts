import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Location } from '@angular/common';
import { vi } from 'vitest';

import { NotFound } from './not-found.component';

describe('NotFound', () => {
  let component: NotFound;
  let fixture: ComponentFixture<NotFound>;
  let locationMock: { back: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    locationMock = { back: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [provideRouter([]), { provide: Location, useValue: locationMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFound);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the 404 heading', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('404');
  });

  it('should call Location.back() when goBack() is invoked', () => {
    component.goBack();
    expect(locationMock.back).toHaveBeenCalledTimes(1);
  });
});
