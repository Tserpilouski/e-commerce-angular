import { Component } from '@angular/core';
import { AddressCard } from './components/address-card/address-card';

@Component({
  selector: 'ec-dashboard',
  imports: [AddressCard],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class Dashboard {
  readonly userName = 'Kiryl';
}
