import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MATERIAL } from '../../material/material';
import { THEME_STATE } from '../../../core/tokens/theme-state.token';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, MATERIAL],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  readonly themeState = inject(THEME_STATE);

  toggleTheme(): void {
    this.themeState.toggleTheme();
  }
}
