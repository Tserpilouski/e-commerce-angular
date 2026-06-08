import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'ec-header',
  imports: [RouterLink, RouterLinkActive, MatIconModule, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
