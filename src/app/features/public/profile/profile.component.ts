
import { Component, ChangeDetectionStrategy, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { PortfolioContentService } from '../../../core/services/portfolio-content.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDividerModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private readonly content = inject(PortfolioContentService);

  readonly profile = this.content.profile;

  readonly location = computed(() => {
    const p = this.profile();
    if (!p) return '';
    const loc = p.facts.find(f => f.label === 'Location');
    return loc ? loc.value : '';
  });

  ngOnInit(): void {
    this.content.loadProfileOnce();
  }
}
