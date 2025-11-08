// src/app/core/services/portfolio-content.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

/** Profile page (JSON-driven) */
export interface ProfileData {
  name: string;
  title: string;
  intro: string;
  avatar: string;
  profile_pic: string;
  ctas: {
    label: string;
    icon: string;
    link: string;
    variant?: 'flat' | 'stroked' | 'link';
  }[];
  values: { icon: string; title: string; description: string }[];
  skills: { category: string; items: string[] }[];
  facts: { label: string; value: string; icon?: string }[];
  highlights?: {
    icon: string;
    title: string;
    subtitle?: string;
    description?: string;
  }[];
}

@Injectable({ providedIn: 'root' })
export class PortfolioContentService {
  private http = inject(HttpClient);

  private readonly DATA = '/assets/data';

  /** Profile */
  private readonly _profile = signal<ProfileData | null>(null);
  readonly profile = this._profile.asReadonly();

  private loaded = {
    profile: false,
  } as const;

  /** Profile */
  loadProfileOnce() {
    this.loadJsonOnce<ProfileData>(
      `${this.DATA}/profile.json`,
      (v) => this._profile.set(v ?? null),
      'profile'
    );
  }

  // ========================
  // Private generic loader
  // ========================
  private loadJsonOnce<T>(
    url: string,
    apply: (v: T | undefined) => void,
    key: keyof typeof this.loaded
  ) {
    if (this.loaded[key]) return;
    this.http
      .get<T>(url)
      .pipe(
        tap(apply),
        catchError((err) => {
          console.warn(`[PortfolioContentService] Failed to load ${url}`, err);
          // still mark as loaded to avoid retry storms; apply empty state
          apply(undefined);
          return of(undefined as unknown as T);
        }),
        tap(() => ((this.loaded as any)[key] = true))
      )
      .subscribe();
  }
}
