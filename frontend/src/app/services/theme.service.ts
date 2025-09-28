import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'stock-insights-theme';
  
  // Signal for reactive theme changes
  private _currentTheme = signal<Theme>(this.getStoredTheme());
  
  get currentTheme() {
    return this._currentTheme.asReadonly();
  }

  constructor() {
    this.applyTheme(this._currentTheme());
  }

  toggleTheme(): void {
    const newTheme: Theme = this._currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this._currentTheme.set(theme);
    this.storeTheme(theme);
    this.applyTheme(theme);
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(this.THEME_KEY);
    return (stored as Theme) || 'light';
  }

  private storeTheme(theme: Theme): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  }

  isDarkMode(): boolean {
    return this._currentTheme() === 'dark';
  }

  isLightMode(): boolean {
    return this._currentTheme() === 'light';
  }

}
