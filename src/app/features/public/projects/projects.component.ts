// src/app/features/projects/projects.component.ts
import { Component, inject, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { PortfolioContentService } from '../../../core/services/portfolio-content.service';
import { RouterLink } from '@angular/router';
import { MATERIAL } from '../../../shared/material/material';

@Component({
  standalone: true,
  selector: 'app-projects',
  imports: [CommonModule, ReactiveFormsModule, MATERIAL],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  private content = inject(PortfolioContentService);

  // one-time load (idempotent)
  constructor() {
    this.content.loadProjectsOnce();
  }

  // search + tech filtering (signal-based)
  readonly search = new FormControl<string>('', { nonNullable: true });
  private readonly searchSig = signal('');
  public readonly selectedTech = signal<Set<string>>(new Set());

  // reflect FormControl value into a signal without subscriptions in template
  private _ = effect(() =>
    this.searchSig.set(this.search.value?.toLowerCase().trim() || '')
  );

  // All projects and distinct tech set
  readonly all = computed(() => this.content.projects());
  readonly techPool = computed(() => {
    const pool = new Set<string>();
    this.all().forEach((p) => p.tech.forEach((t) => pool.add(t)));
    return Array.from(pool).sort((a, b) => a.localeCompare(b));
  });

  // Filtered view
  readonly filtered = computed(() => {
    const term = this.searchSig();
    const techs = this.selectedTech();
    return this.all().filter((p) => {
      const matchesText =
        !term ||
        p.title.toLowerCase().includes(term) ||
        p.summary.toLowerCase().includes(term) ||
        p.tech.some((t) => t.toLowerCase().includes(term));

      const matchesTech = techs.size === 0 || p.tech.some((t) => techs.has(t));
      return matchesText && matchesTech;
    });
  });

  // UI handlers
  toggleTech(tag: string) {
    const copy = new Set(this.selectedTech());
    copy.has(tag) ? copy.delete(tag) : copy.add(tag);
    this.selectedTech.set(copy);
  }
  clearFilters() {
    this.selectedTech.set(new Set());
    this.search.setValue('');
  }

  trackById = (_: number, p: { id: string }) => p.id;

  onTechSelectionChange(tag: string, isSelected: boolean) {
    const next = new Set(this.selectedTech());
    isSelected ? next.add(tag) : next.delete(tag);
    this.selectedTech.set(next);
  }
}
