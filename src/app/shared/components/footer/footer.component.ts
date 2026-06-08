import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ec-footer',
  imports: [FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  email = signal('');

  onSubscribe() {
    if (this.email()) {
      this.email.set('');
    }
  }
}
