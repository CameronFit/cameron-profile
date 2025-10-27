import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

type Cta   = { label: string; icon: string; link: string; variant?: 'flat'|'stroked'|'link' };
type Value = { icon: string; title: string; description: string };
type Skill = { icon: string; text: string };
type Fact  = { label: string; value: string; icon?: string };

export interface ProfileData {
  name: string;
  title: string;
  intro: string;
  avatar: string;
  ctas: Cta[];
  values: Value[];
  skills: Skill[];
  facts: Fact[];
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private http = inject(HttpClient);

  /** JSON-driven profile content */
  readonly data = signal<ProfileData | null>(null);

  constructor() {
    this.http.get<ProfileData>('/assets/data/profile.json').subscribe({
      next: (d) => this.data.set(d),
      error: () => {
        // safe fallback so page still renders if JSON is missing
        this.data.set({
          name: 'Cameron Young',
          title: 'Front-End Angular Engineer',
          intro:
            'I’m an Angular front-end developer focused on building scalable, testable, and visually polished apps. I care about clean architecture, clear UX, and resilient delivery.',
          avatar: '/assets/cam-profile.jpeg',
          ctas: [
            { label: 'View Projects', icon: 'terminal', link: '/portfolio/projects', variant: 'flat' },
            { label: 'View Résumé',   icon: 'description', link: '/portfolio/resume',  variant: 'stroked' }
          ],
          values: [
            { icon: 'architecture', title: 'Craftsmanship', description: 'Elegant, testable, maintainable code.' },
            { icon: 'track_changes', title: 'Clarity', description: 'Readable solutions that scale with teams.' },
            { icon: 'verified_user', title: 'Integrity', description: 'Secure, reliable systems users can trust.' },
            { icon: 'bolt', title: 'Momentum', description: 'Ship iteratively, improve continuously.' }
          ],
          skills: [
            { icon: 'bolt', text: 'Angular 18' },
            { icon: 'data_object', text: 'TypeScript / RxJS' },
            { icon: 'hub', text: 'Signals for State' },
            { icon: 'rule', text: 'Typed Forms' },
            { icon: 'integration_instructions', text: 'InjectionTokens' },
            { icon: 'security', text: 'Interceptors / Guards' },
            { icon: 'palette', text: 'Material M3 + Tokens' }
          ],
          facts: [
            { icon: 'location_on', label: 'Location', value: 'Auckland, New Zealand' },
            { icon: 'event', label: 'Experience', value: '9+ years' },
            { icon: 'alternate_email', label: 'Email', value: 'cm.young.nz@gmail.com' },
            { icon: 'call', label: 'Phone', value: '+64 21 288 7337' },
            { icon: 'language', label: 'LinkedIn', value: 'linkedin.com/in/cameron-young-nz' }
          ]
        });
      }
    });
  }

  /* ngFor helpers */
  trackByTitle = (_: number, v: Value) => v.title;
  trackByText  = (_: number, s: Skill) => s.text;
  trackByLabel = (_: number, f: Fact)  => f.label;
  trackByCta = (_: number, c: Cta) => c.label;

}
