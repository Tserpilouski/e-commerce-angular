import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TabOption } from './models/tabOption.model';

@Component({
  selector: 'ec-tabs',
  imports: [],
  template: `
    <nav class="tabs-container" role="tablist">
      @for (tab of options(); track tab.id) {
        <button
          type="button"
          class="tab-btn"
          [class.tab-btn--active]="activeTabId() === tab.id"
          (click)="selectTab(tab.id)"
          role="tab"
          [aria-selected]="activeTabId() === tab.id"
          [attr.id]="'tab-' + tab.id"
        >
          {{ tab.label }}
        </button>
      }
    </nav>
  `,
  styleUrl: './tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tabs {
  readonly options = input<TabOption[]>([]);
  readonly activeTabId = input<string>('');
  readonly tabChange = output<string>();

  selectTab(id: string) {
    if (this.activeTabId() !== id) {
      this.tabChange.emit(id);
    }
  }
}
