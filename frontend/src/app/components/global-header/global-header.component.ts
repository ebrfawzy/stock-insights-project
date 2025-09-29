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
    <nav class="navbar navbar-expand-lg bg-primary-custom shadow-custom" [class.rtl]="languageService.getCurrentLanguage()().direction === 'rtl'">
      <div class="container-fluid">
        <a class="navbar-brand text-primary-custom fw-bold" routerLink="/">
          <i class="bi bi-graph-up me-2"></i>StockInsights
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" 
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link text-primary-custom" routerLink="/" routerLinkActive="active" 
                 [routerLinkActiveOptions]="{exact: true}">
                {{ languageService.getTranslation('home') }}
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-primary-custom" routerLink="/insights" routerLinkActive="active">
                {{ languageService.getTranslation('insights') }}
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-primary-custom" routerLink="/stocks" routerLinkActive="active">
                {{ languageService.getTranslation('stocks') }}
              </a>
            </li>
          </ul>
          
          <div class="d-flex align-items-center gap-3">
            <button class="btn btn-outline-light btn-sm theme-toggle" (click)="toggleTheme()" 
                    [title]="themeService.isDarkMode() ? languageService.getTranslation('light') : languageService.getTranslation('dark')">
              <i class="bi" [class.bi-sun]="themeService.isDarkMode()" [class.bi-moon]="!themeService.isDarkMode()"></i>
              <span class="ms-1 d-none d-md-inline">{{ themeService.isDarkMode() ? languageService.getTranslation('light') : languageService.getTranslation('dark') }}</span>
            </button>
            
            <div class="dropdown">
              <select class="form-select form-select-sm" (change)="onLanguageChange($event)" 
                      [value]="languageService.getCurrentLanguage()().code" 
                      [title]="languageService.getTranslation('changeLanguage')" style="width: auto;">
                <option *ngFor="let lang of languageService.getLanguages()" [value]="lang.code">
                  {{ lang.flag }} {{ lang.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </nav>
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
