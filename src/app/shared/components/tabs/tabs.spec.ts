import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tabs } from './tabs';
import { TabOption } from './models/tabOption.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Tabs', () => {
  let component: Tabs;
  let fixture: ComponentFixture<Tabs>;
  const mockOptions: TabOption[] = [
    { id: 'tab1', label: 'Tab One' },
    { id: 'tab2', label: 'Tab Two' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tabs],
    }).compileComponents();

    fixture = TestBed.createComponent(Tabs);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the list of tabs', () => {
    fixture.componentRef.setInput('options', mockOptions);
    fixture.componentRef.setInput('activeTabId', 'tab1');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.tab-btn');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent.trim()).toBe('Tab One');
    expect(buttons[1].textContent.trim()).toBe('Tab Two');
  });

  it('should emit tabChange when clicking an inactive tab', () => {
    fixture.componentRef.setInput('options', mockOptions);
    fixture.componentRef.setInput('activeTabId', 'tab1');
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.tabChange, 'emit');
    const buttons = fixture.nativeElement.querySelectorAll('.tab-btn');
    buttons[1].click();

    expect(emitSpy).toHaveBeenCalledWith('tab2');
  });

  it('should not emit tabChange when clicking the already active tab', () => {
    fixture.componentRef.setInput('options', mockOptions);
    fixture.componentRef.setInput('activeTabId', 'tab1');
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.tabChange, 'emit');
    const buttons = fixture.nativeElement.querySelectorAll('.tab-btn');
    buttons[0].click();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
