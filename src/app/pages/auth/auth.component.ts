import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tabs } from '../../shared/components/tabs/tabs';
import { TabOption } from '../../shared/components/tabs/models/tabOption.model';
import { Logo } from '../../shared/components/logo/logo';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthTab } from './model/auth-tab.enum';

@Component({
  selector: 'ec-auth',
  imports: [Tabs, Logo, LoginComponent, RegisterComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly AuthTab = AuthTab;

  readonly activeTab = signal<AuthTab>(AuthTab.LOGIN);
  readonly prefilledEmail = signal<string | null>(null);

  readonly authTabs: TabOption[] = [
    { id: AuthTab.LOGIN, label: 'Sign In' },
    { id: AuthTab.REGISTER, label: 'Create Account' },
  ];

  constructor() {
    this.route.url.subscribe((url) => {
      const path = url[0]?.path;
      if (path === 'register') {
        this.activeTab.set(AuthTab.REGISTER);
      } else {
        this.activeTab.set(AuthTab.LOGIN);
      }
    });
  }

  handleTabChange(tab: string) {
    this.router.navigate([`/${tab}`]);
  }

  handleRegisterSuccess(email: string) {
    this.prefilledEmail.set(email);
    this.router.navigate([`/${AuthTab.LOGIN}`]);
  }

  handleLoginSuccess() {
    this.router.navigate(['/']);
  }
}
