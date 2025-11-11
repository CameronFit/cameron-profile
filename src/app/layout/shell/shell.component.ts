import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';

import { CustomSidenavComponent } from '../custom-sidenav/custom-sidenav.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { filter, map } from 'rxjs';
import { MATERIAL } from '../../shared/material/material';
import { TopbarComponent } from '../../shared/ui/topbar/topbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
     CommonModule,
    RouterOutlet,
    MATERIAL,
    CustomSidenavComponent,
    TopbarComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);

  // manual collapsed state (desktop only)
  readonly collapsed = signal(false);

  // treat XSmall + Small as "mobile/tablet" for layout
  private readonly handsetQuery = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(
        map(result =>
          !!result.breakpoints[Breakpoints.XSmall] ||
          !!result.breakpoints[Breakpoints.Small]
        )
      ),
    { initialValue: false }
  );

  readonly isMobile = computed(() => this.handsetQuery());

  // nav width tokens for desktop; used by SCSS class .app-container.collapsed
  readonly navWidth = computed(() =>
    this.collapsed() ? 'var(--nav-width-collapsed)' : 'var(--nav-width)'
  );

  constructor() {
    // Collapse automatically when switching to mobile/tablet
    effect(() => {
      if (this.isMobile()) {
        this.collapsed.set(true);
      }
    });

    // Auto-close on navigation when mobile/tablet
    const navEnd = toSignal(
      this.router.events.pipe(filter(e => e instanceof NavigationEnd))
    );

    effect(() => {
      navEnd(); // track router changes
      if (this.isMobile()) {
        this.collapsed.set(true);
      }
    });
  }

  toggle = (): void => {
    // On mobile we just toggle "open" via collapsed flag
    // On desktop this is the manual rail collapse/expand
    this.collapsed.update(v => !v);
  };
}
