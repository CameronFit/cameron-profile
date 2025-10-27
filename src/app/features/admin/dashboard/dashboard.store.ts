import { Injectable, computed, signal } from '@angular/core';
import { DashboardService, DashboardData } from './dashboard.service';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly svc = new DashboardService();

  private _loading = signal(false);
  private _data    = signal<DashboardData | null>(null);

  loading = computed(() => this._loading());
  stats   = computed(() => this._data()?.stats ?? null);
  recent  = computed(() => this._data()?.recent ?? []);

  load() {
    this._loading.set(true);
    this.svc.get().then(d => this._data.set(d)).finally(() => this._loading.set(false));
  }
}
