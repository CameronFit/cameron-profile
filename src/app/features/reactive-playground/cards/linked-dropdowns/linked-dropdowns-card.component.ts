import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { toSignal } from '@angular/core/rxjs-interop';
import { MATERIAL } from '../../../../shared/material/material';
import { SelectInputComponent } from '../../../../shared/ui/form-controls/select-input/select-input.component';

@Component({
  selector: 'app-linked-dropdowns-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MATERIAL, SelectInputComponent],
  templateUrl: './linked-dropdowns-card.component.html',
  styleUrls: ['./linked-dropdowns-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedDropdownsCardComponent {
  readonly countries = signal(['New Zealand', 'Australia', 'South Africa']);

  readonly citiesByCountry = signal<Record<string, string[]>>({
    'New Zealand': ['Auckland', 'Wellington', 'Christchurch'],
    Australia: ['Sydney', 'Melbourne', 'Brisbane'],
    'South Africa': ['Johannesburg', 'Cape Town', 'Durban'],
  });

  readonly countryControl = new FormControl<string | null>(null);
  readonly cityControl = new FormControl<string | null>(null);

  // Convert FormControl value to signal so computed() can track it
  readonly selectedCountry = toSignal(this.countryControl.valueChanges, {
    initialValue: null,
  });
  readonly selectedCity = toSignal(this.cityControl.valueChanges, {
    initialValue: null,
  });

  readonly availableCities = computed(() => {
    const country = this.selectedCountry();
    return country ? this.citiesByCountry()[country] ?? [] : [];
  });

  readonly selectedSummary = computed(() => {
    const country = this.selectedCountry();
    const city = this.selectedCity();

    if (country && city) {
      return `You chose ${city}, ${country}.`;
    }

    return 'Pick a country and city.';
  });

  constructor() {
    // Reset city when country changes
    this.countryControl.valueChanges.subscribe(() => {
      this.cityControl.setValue(null);
    });
  }
}
