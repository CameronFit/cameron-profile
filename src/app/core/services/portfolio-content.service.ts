// src/app/core/services/portfolio-content.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

/* =========================
   Types
   ========================= */

export type Badge = { icon: string; text: string };
export type Folder = { path: string; why: string };
export type Flow = { title: string; steps: string[] };

export interface Hero {
  title: string;
  subtitle: string;
  ctas: { label: string; link: string }[];
}

/** Home page (JSON-driven) */
export interface HomeContent {
  intro: {
    title: string;
    subtitle: string;
    ctas: {
      label: string;
      icon?: string;
      link: string;
      variant?: 'flat' | 'stroked' | 'link';
    }[];
  };
  purpose: { title: string; paragraphs: string[] };
  highlights: { icon: string; label: string }[];
}

/** Profile page (JSON-driven) */
export interface ProfileData {
  name: string;
  title: string;
  intro: string;
  avatar: string;
  ctas: {
    label: string;
    icon: string;
    link: string;
    variant?: 'flat' | 'stroked' | 'link';
  }[];
  values: { icon: string; title: string; description: string }[];
  skills: { category: string; items: string[] }[];
  facts: { label: string; value: string; icon?: string }[];
  highlights?: { icon: string; title: string; subtitle?: string; description?: string }[];
}

/** Projects */
export interface ProjectLinks {
  demo?: string;
  repo?: string;
}
export interface Project {
  id: string;
  title: string;
  summary: string;
  tech: string[];
  links?: ProjectLinks;
  featured?: boolean;
  date?: string; // ISO (optional)
}

/** Timeline (simple text entries) */
export interface TimelineEntry {
  year: number;
  text: string;
}

/** Architecture page content (JSON-driven) */
export interface WhatWhyItem {
  title: string;
  body: string;
}
export interface ArchitectureSnippets {
  guard: string;
  authInterceptor: string;
  loadingInterceptor: string;
  errorInterceptor: string;
  authState: string;
  widgetToken: string;
  signalsVsBs: string;
  routes: string;
}
export interface ArchitectureData {
  folders: Folder[];
  flows: Flow[]; // [0]=auth, [1]=loading, [2]=a11yPerf (convention) — but order-agnostic at runtime
  snippets: ArchitectureSnippets;
  whatWhy?: WhatWhyItem[]; // optional — used by the page’s explanatory cards
}

/* =========================
   Service
   ========================= */

@Injectable({ providedIn: 'root' })
export class PortfolioContentService {
  private http = inject(HttpClient);

  /** Asset roots */
  private readonly DATA = '/assets/data';
  private readonly MOCK = '/assets/mock';

  // ========================
  // Signals (state) — no product copy here
  // ========================

  /** Home (single source of truth for hero + badges) */
  private readonly _home = signal<HomeContent | null>(null);
  readonly home = this._home.asReadonly();

  /** Derive hero from home.intro (no duplication) */
  readonly hero = computed<Hero | null>(() => {
    const h = this._home();
    if (!h) return null;
    return {
      title: h.intro.title,
      subtitle: h.intro.subtitle,
      ctas: (h.intro.ctas ?? []).map((c) => ({ label: c.label, link: c.link })),
    };
  });

  /** Derive badges from home.highlights (no duplication) */
  readonly badges = computed<Badge[]>(() => {
    const hl = this._home()?.highlights ?? [];
    return hl.map((h) => ({ icon: h.icon, text: h.label }));
  });

  /** Architecture */
  private readonly _folders = signal<Folder[]>([]);
  readonly folders = this._folders.asReadonly();

  private readonly _archFlows = signal<Flow[]>([]);
  /** Named accessors (JSON-driven, with safe fallbacks) */
  get authFlow(): Flow {
    return (
      this._archFlows()[0] ?? {
        title: 'Auth & Refresh Flow',
        steps: [
          'App boots → silent refresh via HttpOnly cookie.',
          'If ok → access token stored in memory signals.',
          'Interceptor attaches token; 401 triggers one refresh + replay.',
        ],
      }
    );
  }
  get loadingFlow(): Flow {
    return (
      this._archFlows()[1] ?? {
        title: 'Loading & Error Handling',
        steps: [
          'Global loading signal toggled in an interceptor.',
          'Debounce to prevent flicker; finalize() to stop.',
          'Central error mapping → user-safe toasts.',
        ],
      }
    );
  }
  get a11yPerf(): Flow {
    return (
      this._archFlows()[2] ?? {
        title: 'Accessibility & Performance',
        steps: [
          'Material M3 + tokens for contrast & spacing.',
          'OnPush + trackBy to reduce DOM churn.',
          'Lazy routes; defer heavy work; virtual scroll for big lists.',
        ],
      }
    );
  }

  /** Snippets: expose as POJO (template reads `snippets.authState`) — but backed by a signal */
  private readonly _snippets = signal<ArchitectureSnippets>({
    guard: '',
    authInterceptor: '',
    loadingInterceptor: '',
    errorInterceptor: '',
    authState: '',
    widgetToken: '',
    signalsVsBs: '',
    routes: '',
  });
  get snippets(): ArchitectureSnippets {
    return this._snippets();
  }

  /** Optional What/Why cards */
  private readonly _whatWhy = signal<WhatWhyItem[]>([]);
  readonly whatWhy = this._whatWhy.asReadonly();

  /** Profile */
  private readonly _profile = signal<ProfileData | null>(null);
  readonly profile = this._profile.asReadonly();

  /** Projects */
  private readonly _projects = signal<Project[]>([]);
  readonly projects = this._projects.asReadonly();

  /** Skills (simple list or upgrade to richer model later) */
  private readonly _skills = signal<string[]>([]);
  readonly skills = this._skills.asReadonly();

  /** Timeline */
  private readonly _timeline = signal<TimelineEntry[]>([]);
  readonly timeline = this._timeline.asReadonly();

  // Convenience views
  readonly badgeTexts = computed(() => this.badges().map((b) => b.text));

  readonly projectTechPool = computed(() => {
    const pool = new Set<string>();
    for (const p of this._projects()) p.tech.forEach((t) => pool.add(t));
    return Array.from(pool).sort((a, b) => a.localeCompare(b));
  });

  // ========================
  // Load flags (idempotent)
  // ========================
  private loaded = {
    home: false,
    architecture: false, // ← replaces 'folders'
    profile: false,
    projects: false,
    skills: false,
    timeline: false,
    dashboard: false,
  } as const;

  // ========================
  // Public loaders
  // ========================

  /** Home (intro, purpose, highlights) */
  loadHomeOnce() {
    this.loadJsonOnce<HomeContent>(
      `${this.DATA}/home.json`,
      (data) => {
        this._home.set(data ?? null);
      },
      'home'
    );
  }

  /**
   * Architecture (folders + flows + snippets + whatWhy)
   * Single source of truth: /assets/data/architecture.json
   */
  loadArchitectureOnce() {
    this.loadJsonOnce<ArchitectureData>(
      `${this.DATA}/architecture.json`,
      (data) => {
        const d = data ?? {
          folders: [],
          flows: [],
          snippets: this._snippets(),
          whatWhy: [],
        };
        this._folders.set(d.folders ?? []);
        this._archFlows.set(d.flows ?? []);
        this._snippets.set(d.snippets ?? this._snippets());
        this._whatWhy.set(d.whatWhy ?? []);
      },
      'architecture'
    );
  }

  /** Profile */
  loadProfileOnce() {
    this.loadJsonOnce<ProfileData>(
      `${this.DATA}/profile.json`,
      (v) => this._profile.set(v ?? null),
      'profile'
    );
  }

  /** Projects (sorted by date desc when available) */
  loadProjectsOnce() {
    this.loadJsonOnce<Project[]>(
      `${this.DATA}/projects.json`,
      (list) => {
        const sorted = (list ?? [])
          .slice()
          .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        this._projects.set(sorted);
      },
      'projects'
    );
  }

  /** Skills */
  loadSkillsOnce() {
    this.loadJsonOnce<string[]>(
      `${this.DATA}/skills.json`,
      (v) => this._skills.set(v ?? []),
      'skills'
    );
  }

  /** Timeline */
  loadTimelineOnce() {
    this.loadJsonOnce<TimelineEntry[]>(
      `${this.DATA}/timeline.json`,
      (v) => this._timeline.set(v ?? []),
      'timeline'
    );
  }

  /** Demo data for dashboard (optional) */
  loadDashboardMockOnce() {
    this.loadJsonOnce<any>(
      `${this.MOCK}/dashboard.json`,
      () => {},
      'dashboard'
    );
  }

  /** Convenience: load all public content */
  loadPublicContentOnce() {
    this.loadHomeOnce();
    this.loadArchitectureOnce();
    this.loadProfileOnce();
    this.loadProjectsOnce();
    this.loadSkillsOnce();
    this.loadTimelineOnce();
    // optional: this.loadDashboardMockOnce();
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

  // ========================
  // (Legacy inline docs removed — now JSON-driven)
  // ========================
}
