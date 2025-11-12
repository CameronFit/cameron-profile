import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of, delay, tap } from 'rxjs';
import { MATERIAL } from '../../../../shared/material/material';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AppState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: string[];
  lastSync: Date | null;
}

interface ApiResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  permissions: string[];
}

@Component({
  selector: 'app-cache-strategy-card',
  standalone: true,
  imports: [CommonModule, MATERIAL],
  templateUrl: './cache-strategy-card.component.html',
  styleUrls: ['./cache-strategy-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CacheStrategyCardComponent {
  // Simulated global state (like NgRx Store or Service state)
  private readonly globalState = signal<AppState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    permissions: [],
    lastSync: null
  });

  readonly state = this.globalState.asReadonly();
  readonly isLoading = signal(false);
  readonly apiCallLog = signal<Array<{ action: string; timestamp: Date; data?: any }>>([]);
  
  readonly isAuthenticated = computed(() => !!this.state().accessToken);
  readonly userRole = computed(() => this.state().user?.role || 'guest');

  login(): void {
    this.isLoading.set(true);
    this.logAction('🔐 POST /api/auth/login', 'Initiating login...');

    // Simulate API call with tap operator to populate state
    of(this.mockApiResponse()).pipe(
      delay(1500),
      tap(response => {
        // This is the key pattern: use tap to update global state
        this.globalState.update(state => ({
          ...state,
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          permissions: response.permissions,
          lastSync: new Date()
        }));
        
        this.logAction('✅ Login Success', response);
      })
    ).subscribe({
      next: () => {
        this.isLoading.set(false);
      }
    });
  }

  refreshAccessToken(): void {
    if (!this.state().refreshToken) return;
    
    this.logAction('🔄 POST /api/auth/refresh', 'Refreshing access token...');
    
    of({ accessToken: `new_token_${Date.now()}` }).pipe(
      delay(800),
      tap(response => {
        // Update only the access token in state
        this.globalState.update(state => ({
          ...state,
          accessToken: response.accessToken,
          lastSync: new Date()
        }));
        
        this.logAction('✅ Token Refreshed', response);
      })
    ).subscribe();
  }

  fetchUserProfile(): void {
    if (!this.isAuthenticated()) {
      this.logAction('❌ Unauthorized', 'Please login first');
      return;
    }

    this.logAction('👤 GET /api/user/profile', 'Fetching profile with token...');
    
    of({ ...this.state().user, lastLogin: new Date() }).pipe(
      delay(1000),
      tap(profile => {
        // Update user profile in state
        this.globalState.update(state => ({
          ...state,
          user: { ...state.user!, ...profile }
        }));
        
        this.logAction('✅ Profile Updated', profile);
      })
    ).subscribe();
  }

  logout(): void {
    this.logAction('🚪 POST /api/auth/logout', 'Logging out...');
    
    of(null).pipe(
      delay(500),
      tap(() => {
        // Clear all state
        this.globalState.set({
          user: null,
          accessToken: null,
          refreshToken: null,
          permissions: [],
          lastSync: null
        });
        
        this.logAction('✅ Logged Out', 'State cleared');
        
        // Clear the API log
        setTimeout(() => this.apiCallLog.set([]), 1000);
      })
    ).subscribe();
  }

  clearLog(): void {
    this.apiCallLog.set([]);
  }

  private mockApiResponse(): ApiResponse {
    return {
      user: {
        id: 1,
        name: 'Cameron Young',
        email: 'cameron@example.com',
        role: 'admin'
      },
      accessToken: `token_${Date.now()}`,
      refreshToken: `refresh_${Date.now()}`,
      permissions: ['read', 'write', 'delete', 'admin']
    };
  }

  private logAction(action: string, data: any): void {
    this.apiCallLog.update(log => [...log, {
      action,
      timestamp: new Date(),
      data: typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    }]);
  }
}
