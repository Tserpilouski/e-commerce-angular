import { Component } from '@angular/core';
import { Button } from '@app/shared/components/button/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ec-not-found',
  imports: [Button, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFound {}
