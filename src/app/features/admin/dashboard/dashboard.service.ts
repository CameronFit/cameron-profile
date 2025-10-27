export interface DashboardData {
  stats: { projects: number; skills: number; views: number; lastUpdated: string };
  recent: Array<{ title: string; time: string }>;
}

export class DashboardService {
  async get(): Promise<DashboardData> {
    const res = await fetch('/assets/mock/dashboard.json', { credentials: 'same-origin' });
    if (!res.ok) throw new Error('Failed to load dashboard data');
    return (await res.json()) as DashboardData;
  }
}
