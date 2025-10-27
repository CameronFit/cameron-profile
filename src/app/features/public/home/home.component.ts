import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PortfolioContentService } from '../../../core/services/portfolio-content.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly content = inject(PortfolioContentService);

  /** Read the service's readonly signal directly (no local writes, no effects). */
  readonly data = this.content.home;

  constructor() {
    // idempotent fetch for /assets/data/home.json
    this.content.loadHomeOnce();
  }

  trackByLabel = (_: number, x: { label: string }) => x.label;
}
