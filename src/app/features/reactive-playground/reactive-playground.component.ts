import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { LiveFormCardComponent } from './cards/live-form/live-form-card.component';
import { SmartSearchCardComponent } from './cards/smart-search/smart-search-card.component';
import { LinkedDropdownsCardComponent } from './cards/linked-dropdowns/linked-dropdowns-card.component';
import { ApiPollingCardComponent } from './cards/api-polling/api-polling-card.component';
import { CacheStrategyCardComponent } from './cards/cache-strategy/cache-strategy-card.component';
import { MATERIAL } from '../../shared/material/material';

interface DemoTab {
  label: string;
  icon: string;
  description: string;
  component: 'live-form' | 'smart-search' | 'linked-dropdowns' | 'api-polling' | 'cache-strategy';
}

@Component({
  selector: 'app-reactive-playground',
  standalone: true,
  imports: [
    CommonModule,
    MATERIAL,
    LiveFormCardComponent,
    SmartSearchCardComponent,
    LinkedDropdownsCardComponent,
    ApiPollingCardComponent,
    CacheStrategyCardComponent,
  ],
  templateUrl: './reactive-playground.component.html',
  styleUrls: ['./reactive-playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactivePlaygroundComponent {
  readonly activeTab = signal(0);

  readonly tabs: DemoTab[] = [
    {
      label: 'Live Form',
      icon: 'edit_document',
      description: 'Real-time form validation with instant feedback',
      component: 'live-form'
    },
    {
      label: 'Smart Search',
      icon: 'search',
      description: 'Debounced search with live filtering',
      component: 'smart-search'
    },
    {
      label: 'Linked Dropdowns',
      icon: 'link',
      description: 'Cascading dropdowns with reactive dependencies',
      component: 'linked-dropdowns'
    },
    {
      label: 'API Polling',
      icon: 'cloud_sync',
      description: 'Long-running job monitoring with interval polling',
      component: 'api-polling'
    },
    {
      label: 'State Management',
      icon: 'account_circle',
      description: 'Using tap() to populate global state (auth, tokens, user data)',
      component: 'cache-strategy'
    },
  ];
}