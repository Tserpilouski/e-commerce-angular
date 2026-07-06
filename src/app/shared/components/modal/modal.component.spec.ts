import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render content when closed', () => {
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.modal')).toBeNull();
  });

  it('should render overlay when open', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.modal-overlay')).not.toBeNull();
  });

  it('should emit closed on overlay click when closeOnOverlay is true', () => {
    let closedCount = 0;
    component.closed.subscribe(() => closedCount++);
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('closeOnOverlay', true);
    fixture.detectChanges();
    component.onOverlayClick();
    expect(closedCount).toBe(1);
  });

  it('should not emit closed on overlay click when closeOnOverlay is false', () => {
    let closedCount = 0;
    component.closed.subscribe(() => closedCount++);
    fixture.componentRef.setInput('closeOnOverlay', false);
    fixture.detectChanges();
    component.onOverlayClick();
    expect(closedCount).toBe(0);
  });
});
