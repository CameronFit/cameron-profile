import { InjectionToken } from '@angular/core';

export interface DocsConfig {
  resumeUrl: string;
  coverLetterUrl: string;
}

export const DOCS_CONFIG = new InjectionToken<DocsConfig>('DOCS_CONFIG', {
  factory: () => ({
    resumeUrl: '/assets/docs/cameron-resume.pdf',
    coverLetterUrl: '/assets/docs/cameron-cover-letter.pdf',
  }),
});
