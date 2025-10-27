import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, AsyncPipe, NgFor, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private store = inject(DashboardStore);

  loading = this.store.loading;
  stats   = this.store.stats;
  recent  = this.store.recent;
  reload  = () => this.store.load();

  // Optional computed example
  totalProjects = computed(() => this.stats()?.projects ?? 0);

  ngOnInit() {
    this.store.load();
  }
}
