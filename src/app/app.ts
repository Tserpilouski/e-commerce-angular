import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '@shared/components/header/header.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { Toast } from '@shared/components/toast/toast.component';

@Component({
  selector: 'ec-root',
  imports: [RouterOutlet, ReactiveFormsModule, HeaderComponent, FooterComponent, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
