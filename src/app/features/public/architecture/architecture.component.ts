import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { ArchitectureSnippets, PortfolioContentService } from '../../../core/services/portfolio-content.service';

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, MatButtonModule, MatExpansionModule],
  templateUrl: './architecture.component.html',
  styleUrls: ['./architecture.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchitectureComponent {
  private readonly contentSvc = inject(PortfolioContentService);

  // Service provides signals; expose as computeds for template use
  readonly badges = computed(() => this.contentSvc.badges());
  readonly folders = computed(() => this.contentSvc.folders());
  readonly whatWhy = computed(() => this.contentSvc.whatWhy());

  // Snippets dictionary from service (plain object)
  readonly snippets: ArchitectureSnippets = this.contentSvc.snippets;

  // Show these in Interceptors section
  readonly snippetKeys: (keyof ArchitectureSnippets)[] = ['authInterceptor', 'loadingInterceptor', 'errorInterceptor'];

  /**
   * Jump to a target panel and smooth scroll to its DOM anchor.
   * Uses <button> callers (not <a href="#">) to avoid router/hash side-effects.
   */
  jump(panel: MatExpansionPanel, id: string, evt?: Event) {
    if (evt) evt.preventDefault();
    panel.open();

    // Slight delay lets the panel expand before scrolling
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const absoluteY = window.scrollY + rect.top - 16; // offset for breathing room
      window.scrollTo({ top: absoluteY, behavior: 'smooth' });
    });
  }

  // trackBys for *ngFor performance
  trackByText = (_: number, b: { text: string }) => b.text;
  trackByPath = (_: number, f: { path: string }) => f.path;
  trackByTitle = (_: number, f: { title: string }) => f.title;
}
