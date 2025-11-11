import {
  Component,
  Input,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { MATERIAL } from '../../shared/material/material';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  query?: Record<string, unknown>;
}

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MATERIAL],
  templateUrl: './custom-sidenav.component.html',
  styleUrls: ['./custom-sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSidenavComponent {
  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

  readonly menuItems = signal<readonly NavItem[]>([
    { label: 'Profile', route: '/profile', icon: 'account_circle', query: {} },
    { label: 'Resume', route: '/resume', icon: 'article', query: {} },
    { label: 'Contact', route: '/contact', icon: 'mail', query: {} },
    { label: 'Reactive Playground', route: '/reactive-playground', icon: 'science', query: {} },
  ]);
}
