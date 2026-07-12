import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Button } from '@app/shared/components/button/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ec-not-found',
  imports: [Button, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFound {
  private readonly location = inject(Location);

  goBack(): void {
    this.location.back();
  }
}
