import { Component, ChangeDetectionStrategy, signal, computed, effect, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { interval, switchMap, takeWhile, of, delay } from 'rxjs';
import { MATERIAL } from '../../../../shared/material/material';

interface PollingStatus {
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  pollCount: number;
}

@Component({
  selector: 'app-api-polling-card',
  standalone: true,
  imports: [CommonModule, MATERIAL],
  templateUrl: './api-polling-card.component.html',
  styleUrls: ['./api-polling-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiPollingCardComponent {
  private destroyRef = inject(DestroyRef);
  
  readonly isPolling = signal(false);
  readonly pollingData = signal<PollingStatus>({
    status: 'pending',
    progress: 0,
    message: 'Click "Start Job" to begin',
    pollCount: 0
  });

  readonly statusColor = computed(() => {
    switch (this.pollingData().status) {
      case 'pending': return 'accent';
      case 'processing': return 'primary';
      case 'completed': return 'success';
      case 'error': return 'warn';
      default: return 'primary';
    }
  });

  readonly statusIcon = computed(() => {
    switch (this.pollingData().status) {
      case 'pending': return 'schedule';
      case 'processing': return 'sync';
      case 'completed': return 'check_circle';
      case 'error': return 'error';
      default: return 'help';
    }
  });

  startPolling(): void {
    this.isPolling.set(true);
    this.pollingData.set({
      status: 'processing',
      progress: 0,
      message: 'Job started... Polling every 2 seconds',
      pollCount: 0
    });

    // Simulate API polling every 2 seconds
    interval(2000)
      .pipe(
        takeWhile(() => this.isPolling()),
        switchMap(() => this.simulateApiCall())
      )
      .subscribe({
        next: (data) => {
          this.pollingData.update(current => ({
            ...data,
            pollCount: current.pollCount + 1
          }));

          if (data.status === 'completed' || data.status === 'error') {
            this.isPolling.set(false);
          }
        }
      });
  }

  stopPolling(): void {
    this.isPolling.set(false);
    this.pollingData.update(current => ({
      ...current,
      message: 'Polling stopped by user',
      status: 'pending'
    }));
  }

  reset(): void {
    this.isPolling.set(false);
    this.pollingData.set({
      status: 'pending',
      progress: 0,
      message: 'Click "Start Job" to begin',
      pollCount: 0
    });
  }

  private simulateApiCall() {
    const currentProgress = this.pollingData().progress;
    const increment = Math.floor(Math.random() * 20) + 10;
    const newProgress = Math.min(currentProgress + increment, 100);

    return of({
      status: newProgress >= 100 ? 'completed' : 'processing',
      progress: newProgress,
      message: newProgress >= 100 
        ? '✅ Job completed successfully!' 
        : `Processing... ${newProgress}% complete`
    } as PollingStatus).pipe(delay(100));
  }
}
