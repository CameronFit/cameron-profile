import { Component, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CustomSidenavComponent } from '../custom-sidenav/custom-sidenav.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatToolbarModule,
    CustomSidenavComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  collapsed = signal(false);
  isMobile = signal(false);
  
  // Optional: expose widths if you want to show tooltips or calculate sizes elsewhere
  navWidth = computed(() =>
    this.collapsed() ? 'var(--nav-width-collapsed)' : 'var(--nav-width)'
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {}

  ngOnInit() {
    // Monitor screen size changes
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile.set(result.matches);
        if (result.matches) {
          this.collapsed.set(true);
        }
      });

    // Close sidenav on mobile after navigation
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.isMobile()) {
          this.collapsed.set(true);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggle = () => {
    this.collapsed.update(v => !v);
  };
}
