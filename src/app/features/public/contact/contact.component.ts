import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DOCS_CONFIG } from '../../../core/tokens/docs.token';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private fb = inject(NonNullableFormBuilder);
  private snack = inject(MatSnackBar);
  private docs = inject(DOCS_CONFIG);

  // Quick links
  readonly email = 'cm.young.nz@gmail.com';
  readonly linkedIn = 'https://www.linkedin.com/in/cameron-young-nz';
  readonly resumeUrl = this.docs.resumeUrl;
  readonly coverUrl = this.docs.coverLetterUrl;

  // Typed, reactive form
  readonly form = this.fb.group({
    name: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: this.fb.control('', {
      validators: [Validators.required, Validators.email],
    }),
    subject: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    message: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(10)],
    }),
  });

  readonly disabled = computed(() => this.form.invalid || this.sending());
  readonly sending = signal(false);

  openMailClient() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snack.open('Please fix the highlighted fields.', 'Close', {
        duration: 2500,
      });
      return;
    }

    this.sending.set(true);

    const { name, email, subject, message } = this.form.getRawValue();
    // Build a safe mailto link
    const esc = (s: string) => encodeURIComponent(s ?? '');
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const href = `mailto:${this.email}?subject=${esc(subject)}&body=${esc(
      body
    )}`;

    // Open user mail client (no backend; demo-friendly)
    window.location.href = href;

    // UX feedback
    this.snack.open('Opening your mail client…', undefined, { duration: 2000 });
    setTimeout(() => this.sending.set(false), 400);
  }

  downloadResume() {
    window.open(this.resumeUrl, '_blank', 'noopener');
  }

  downloadCover() {
    window.open(this.coverUrl, '_blank', 'noopener');
  }
}
