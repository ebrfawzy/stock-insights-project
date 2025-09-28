import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="global-header" [class.rtl]="languageService.getCurrentLanguage()().direction === 'rtl'">
      <div class="container">
        <div class="nav">
          <div class="logo">
            <h2>📈 StockInsights</h2>
          </div>
          <div class="nav-links">
            <a routerLink="/" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              {{ languageService.getTranslation('home') }}
            </a>
            <a routerLink="/insights" class="nav-link" routerLinkActive="active">
              {{ languageService.getTranslation('insights') }}
            </a>
            <a routerLink="/stocks" class="nav-link" routerLinkActive="active">
              {{ languageService.getTranslation('stocks') }}
            </a>
          </div>
          <div class="nav-controls">
            <button class="theme-toggle" (click)="toggleTheme()" [title]="themeService.isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
              <span class="theme-icon">{{ themeService.isDarkMode() ? '☀️' : '🌙' }}</span>
              <span class="theme-text">{{ themeService.isDarkMode() ? 'Light' : 'Dark' }}</span>
            </button>
            <div class="language-switcher">
              <select (change)="onLanguageChange($event)" [value]="languageService.getCurrentLanguage()().code" [title]="'Change Language'">
                <option *ngFor="let lang of languageService.getLanguages()" [value]="lang.code">
                  {{ lang.flag }} {{ lang.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  `
})
export class GlobalHeaderComponent {
  constructor(
    public languageService: LanguageService,
    public themeService: ThemeService
  ) {}

  onLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.languageService.setLanguage(target.value);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
