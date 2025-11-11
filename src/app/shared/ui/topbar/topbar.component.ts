import {
  Component,
  inject,
  ChangeDetectionStrategy,
  signal,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AUTH_STATE } from '../../../core/tokens/auth-state.token';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    ThemeToggleComponent,
  ],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  private auth = inject(AUTH_STATE);
  // derive auth state via signal accessors (avoid calling functions in template repeatedly if needed)
  isAuthed = () => this.auth.isAuthenticated();
  isLoading = signal(false);

  // Shell toolbar behavior inputs/outputs
  @Input() collapsed = false;
  @Output() toggleNav = new EventEmitter<void>();

  onToggle(): void {
    this.toggleNav.emit();
  }
}
