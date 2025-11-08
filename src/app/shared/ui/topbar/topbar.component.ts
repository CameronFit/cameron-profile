import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AUTH_STATE } from '../../../core/tokens/auth-state.token';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, MatToolbarModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  private auth = inject(AUTH_STATE);
  // derive auth state via signal accessors (avoid calling functions in template repeatedly if needed)
  isAuthed = () => this.auth.isAuthenticated();
}
