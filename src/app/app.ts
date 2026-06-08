import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'ec-root',
  imports: [RouterOutlet, ReactiveFormsModule, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
