import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentOrdersCard } from './recent-orders-card';

describe('RecentOrdersCard', () => {
  let component: RecentOrdersCard;
  let fixture: ComponentFixture<RecentOrdersCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentOrdersCard],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentOrdersCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
