import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { LiveFormCardComponent } from './cards/live-form/live-form-card.component';
import { SmartSearchCardComponent } from './cards/smart-search/smart-search-card.component';
import { LinkedDropdownsCardComponent } from './cards/linked-dropdowns/linked-dropdowns-card.component';
import { MATERIAL } from '../../shared/material/material';

@Component({
  selector: 'app-reactive-playground',
  standalone: true,
  imports: [
    CommonModule,
    MATERIAL,
    LiveFormCardComponent,
    SmartSearchCardComponent,
    LinkedDropdownsCardComponent,
  ],
  templateUrl: './reactive-playground.component.html',
  styleUrls: ['./reactive-playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactivePlaygroundComponent {}