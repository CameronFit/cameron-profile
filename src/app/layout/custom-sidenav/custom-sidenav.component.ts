import { Component, computed, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ add this
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AUTH_STATE } from '../../core/tokens/auth-state.token';

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
  ], // ✅ include CommonModule
  templateUrl: './custom-sidenav.component.html',
  styleUrls: ['./custom-sidenav.component.scss'],
})
export class CustomSidenavComponent {
  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

  private auth = inject(AUTH_STATE);

  private readonly allItems = [
    { label: 'Home', route: '/home', icon: 'home', roles: ['public'] },
    { label: 'Profile', route: '/profile', icon: 'person', roles: ['public'] },
    { label: 'Projects', route: '/projects', icon: 'work', roles: ['public'] },
    {
      label: 'Architecture',
      route: '/architecture',
      icon: 'account_tree',
      roles: ['public'],
    },
    {
      label: 'Résumé',
      route: '/portfolio/resume',
      icon: 'description',
      roles: ['public'],
    },
    // { label: 'Playground',   route: '/playground',       icon: 'toys',           roles: ['public'] },
    { label: 'Contact', route: '/contact', icon: 'mail', roles: ['public'] },
    { label: 'Admin', route: '/admin', icon: 'lock', roles: ['admin'] },
  ];

  readonly menuItems = computed(() => {
    const isAdmin = this.auth.hasRole('admin');
    return this.allItems.filter(
      (i) =>
        i.roles.includes('public') || (isAdmin && i.roles.includes('admin'))
    );
  });

  profilePicSize = computed(() => (this.sideNavCollapsed() ? '32' : '100'));
}
