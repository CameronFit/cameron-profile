import { InjectionToken, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

export interface ThemeSignals {
  currentTheme: ReturnType<typeof signal<Theme>>;
  isDark: () => boolean;
  isLight: () => boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const THEME_STATE = new InjectionToken<ThemeSignals>('THEME_STATE', {
  providedIn: 'root',
  factory: () => {
    // Try to load theme from localStorage, default to dark
    const savedTheme = (typeof window !== 'undefined' 
      ? localStorage.getItem('theme') 
      : null) as Theme | null;
    
    const currentTheme = signal<Theme>(savedTheme || 'dark');

    const isDark = () => currentTheme() === 'dark';
    const isLight = () => currentTheme() === 'light';

    const setTheme = (theme: Theme) => {
      currentTheme.set(theme);
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
      }
    };

    const toggleTheme = () => {
      setTheme(isDark() ? 'light' : 'dark');
    };

    // Initialize theme on document
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', currentTheme());
    }

    // Sync theme changes to document and localStorage
    effect(() => {
      const theme = currentTheme();
      if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
      }
    });

    return { currentTheme, isDark, isLight, toggleTheme, setTheme };
  }
});
