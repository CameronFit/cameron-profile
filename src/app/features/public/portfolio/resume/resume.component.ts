import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DOCS_CONFIG } from '../../../../core/tokens/docs.token';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

type DocKind = 'resume' | 'cover';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cfg = inject(DOCS_CONFIG);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroy$ = new Subject<void>();

  readonly isMobile = signal(false);

  ngOnInit() {
    // Monitor screen size changes
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile.set(result.matches);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Which doc are we showing? Default to 'resume'; sync with ?doc=cover|resume
  readonly doc = signal<DocKind>('resume');

  constructor() {
    // Read the initial query param once on construct (no subscription needed for this case)
    const qp = this.route.snapshot.queryParamMap.get('doc') as DocKind | null;
    if (qp === 'cover' || qp === 'resume') this.doc.set(qp);
  }

  // Is résumé showing?
  readonly isResume = () => this.doc() === 'resume';

  // Plain URL (for buttons/links)
  readonly plainUrl = computed(() =>
    this.isResume() ? this.cfg.resumeUrl : this.cfg.coverLetterUrl
  );

  // Safe URL (for <object [data]> / <iframe [src]>)
  readonly safeUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.plainUrl())
  );

  readonly currentDocLabel = computed(() =>
    this.isResume() ? 'Résumé' : 'Cover Letter'
  );

  show(kind: DocKind) {
    if (this.doc() === kind) return;
    this.doc.set(kind);
    // reflect state in the URL (nice for copy/paste and refresh)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { doc: kind },
      queryParamsHandling: 'merge',
    });
  }

  back() {
    this.router.navigateByUrl('/');
  }

  print() {
    // open the current doc in a new tab and trigger print
    window.open(this.plainUrl(), '_blank', 'noopener')?.print();
  }
}
