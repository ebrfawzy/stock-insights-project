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
    <nav class="navbar navbar-expand-lg bg-primary navbar-dark shadow" [attr.dir]="languageService.getCurrentLanguage()().direction">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" routerLink="/">
          <i class="bi bi-graph-up me-2"></i>StockInsights
        </a>
        
        <button class="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav" 
                aria-controls="navbarNav" 
                aria-expanded="false" 
                aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" 
                 [routerLinkActiveOptions]="{exact: true}">
                {{ languageService.getTranslation('home') }}
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/insights" routerLinkActive="active">
                {{ languageService.getTranslation('insights') }}
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/stocks" routerLinkActive="active">
                {{ languageService.getTranslation('stocks') }}
              </a>
            </li>
          </ul>
          
          <div class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2 gap-lg-3 mt-3 mt-lg-0">
            <button class="btn btn-outline-light btn-sm w-100 w-lg-auto" 
                    (click)="toggleTheme()" 
                    [title]="themeService.isDarkMode() ? languageService.getTranslation('light') : languageService.getTranslation('dark')">
              <i class="bi me-1" [class.bi-sun]="themeService.isDarkMode()" [class.bi-moon]="!themeService.isDarkMode()"></i>
              <span>{{ themeService.isDarkMode() ? languageService.getTranslation('light') : languageService.getTranslation('dark') }}</span>
            </button>
            
            <select class="form-select form-select-sm w-100 w-lg-auto" 
                    (change)="onLanguageChange($event)" 
                    [value]="languageService.getCurrentLanguage()().code" 
                    [title]="languageService.getTranslation('changeLanguage')">
              <option *ngFor="let lang of languageService.getLanguages()" [value]="lang.code">
                {{ lang.flag }} {{ lang.name }}
              </option>
            </select>
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
