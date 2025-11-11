import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { of, delay } from 'rxjs';
import { MATERIAL } from '../../../../shared/material/material';
import { SearchInputComponent } from '../../../../shared/ui/form-controls/search-input/search-input.component';

@Component({
  selector: 'app-smart-search-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MATERIAL,
    SearchInputComponent,
  ],
  templateUrl: './smart-search-card.component.html',
  styleUrls: ['./smart-search-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartSearchCardComponent {
  readonly isLoading = signal(false);
  
  readonly searchControl = new FormControl('', { nonNullable: true });
  
  private readonly allItems = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve','Cameron','Pete'];

  private readonly searchResults$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.isLoading.set(true)),
    switchMap(term => this.fakeSearch(term)),
    tap(() => this.isLoading.set(false))
  );

  readonly results = toSignal(this.searchResults$, { initialValue: [] });

  get hasTerm(): boolean {
    return this.searchControl.value.trim().length > 0;
  }

  private fakeSearch(term: string) {
    if (!term.trim()) {
      return of([]);
    }
    
    const filtered = this.allItems.filter(item =>
      item.toLowerCase().includes(term.toLowerCase())
    );
    
    return of(filtered).pipe(delay(500));
  }
}
