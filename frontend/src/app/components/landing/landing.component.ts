import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-secondary-custom" [class.rtl]="languageService.getCurrentLanguage()().direction === 'rtl'">

      <!-- Hero Section -->
      <section class="py-5 bg-primary text-white">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <h1 class="display-4 fw-bold mb-4">{{ languageService.getTranslation('welcomeTitle') }}</h1>
              <p class="lead mb-4">{{ languageService.getTranslation('welcomeSubtitle') }}</p>
              <div class="d-flex gap-3 flex-wrap">
                <button class="btn btn-light btn-lg" (click)="goToInsights()">
                  <i class="bi bi-graph-up me-2"></i>{{ languageService.getTranslation('getStarted') }}
                </button>
                <button class="btn btn-outline-light btn-lg" (click)="goToStocks()">
                  <i class="bi bi-list-ul me-2"></i>{{ languageService.getTranslation('exploreStocks') }}
                </button>
              </div>
            </div>
            <div class="col-lg-6 mt-4 mt-lg-0">
              <div class="bg-white bg-opacity-10 rounded p-4">
                <div class="d-flex justify-content-between align-items-end" style="height: 200px;">
                  <div class="bg-success rounded" style="width: 20px; height: 60%;"></div>
                  <div class="bg-success rounded" style="width: 20px; height: 80%;"></div>
                  <div class="bg-warning rounded" style="width: 20px; height: 45%;"></div>
                  <div class="bg-success rounded" style="width: 20px; height: 90%;"></div>
                  <div class="bg-success rounded" style="width: 20px; height: 70%;"></div>
                  <div class="bg-success rounded" style="width: 20px; height: 85%;"></div>
                  <div class="bg-danger rounded" style="width: 20px; height: 55%;"></div>
                  <div class="bg-success rounded" style="width: 20px; height: 95%;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-5">
        <div class="container">
          <h2 class="text-center text-primary-custom mb-5">{{ languageService.getTranslation('keyFeatures') }}</h2>
          <div class="row g-4">
            <div class="col-md-6 col-lg-3">
              <div class="card h-100 shadow-custom border-0">
                <div class="card-body text-center">
                  <div class="mb-3">
                    <i class="bi bi-graph-up text-primary" style="font-size: 3rem;"></i>
                  </div>
                  <h5 class="card-title text-primary-custom">{{ languageService.getTranslation('featureRealTimeDataTitle') }}</h5>
                  <p class="card-text text-muted-custom">{{ languageService.getTranslation('featureRealTimeDataDesc') }}</p>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3">
              <div class="card h-100 shadow-custom border-0">
                <div class="card-body text-center">
                  <div class="mb-3">
                    <i class="bi bi-bullseye text-primary" style="font-size: 3rem;"></i>
                  </div>
                  <h5 class="card-title text-primary-custom">{{ languageService.getTranslation('featureSmartInsightsTitle') }}</h5>
                  <p class="card-text text-muted-custom">{{ languageService.getTranslation('featureSmartInsightsDesc') }}</p>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3">
              <div class="card h-100 shadow-custom border-0">
                <div class="card-body text-center">
                  <div class="mb-3">
                    <i class="bi bi-bar-chart text-primary" style="font-size: 3rem;"></i>
                  </div>
                  <h5 class="card-title text-primary-custom">{{ languageService.getTranslation('featureTechnicalAnalysisTitle') }}</h5>
                  <p class="card-text text-muted-custom">{{ languageService.getTranslation('featureTechnicalAnalysisDesc') }}</p>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3">
              <div class="card h-100 shadow-custom border-0">
                <div class="card-body text-center">
                  <div class="mb-3">
                    <i class="bi bi-cash-coin text-primary" style="font-size: 3rem;"></i>
                  </div>
                  <h5 class="card-title text-primary-custom">{{ languageService.getTranslation('featureInvestmentStrategiesTitle') }}</h5>
                  <p class="card-text text-muted-custom">{{ languageService.getTranslation('featureInvestmentStrategiesDesc') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Market Overview -->
      <section class="py-5 bg-light">
        <div class="container">
          <h2 class="text-center text-primary-custom mb-5">{{ languageService.getTranslation('marketOverview') }}</h2>
          <div class="row g-4">
            <div class="col-md-6 col-lg-3">
              <div class="text-center">
                <div class="display-4 fw-bold text-primary mb-2">250+</div>
                <div class="text-muted-custom">{{ languageService.getTranslation('statsStocksTracked') }}</div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3">
              <div class="text-center">
                <div class="display-4 fw-bold text-success mb-2">24/7</div>
                <div class="text-muted-custom">{{ languageService.getTranslation('statsRealTimeUpdates') }}</div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3">
              <div class="text-center">
                <div class="display-4 fw-bold text-info mb-2">50+</div>
                <div class="text-muted-custom">{{ languageService.getTranslation('statsTechnicalIndicators') }}</div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3">
              <div class="text-center">
                <div class="display-4 fw-bold text-warning mb-2">100%</div>
                <div class="text-muted-custom">{{ languageService.getTranslation('statsFreeAccess') }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-5 bg-primary text-white">
        <div class="container">
          <div class="text-center">
            <h2 class="mb-4">{{ languageService.getTranslation('ctaTitle') }}</h2>
            <p class="lead mb-4">{{ languageService.getTranslation('ctaSubtitle') }}</p>
            <button class="btn btn-light btn-lg" (click)="goToInsights()">
              <i class="bi bi-rocket-takeoff me-2"></i>{{ languageService.getTranslation('ctaButton') }}
            </button>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-dark text-white py-5">
        <div class="container">
          <div class="row">
            <div class="col-md-4 mb-4">
              <h5 class="fw-bold mb-3">
                <i class="bi bi-graph-up me-2"></i>StockInsights
              </h5>
              <p class="text-light">{{ languageService.getTranslation('footerTagline') }}</p>
            </div>
            <div class="col-md-4 mb-4">
              <h6 class="fw-bold mb-3">{{ languageService.getTranslation('quickLinks') }}</h6>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <a routerLink="/insights" class="text-light text-decoration-none">
                    <i class="bi bi-arrow-right me-2"></i>{{ languageService.getTranslation('marketInsightsLink') }}
                  </a>
                </li>
                <li class="mb-2">
                  <a routerLink="/stocks" class="text-light text-decoration-none">
                    <i class="bi bi-arrow-right me-2"></i>{{ languageService.getTranslation('stockListLink') }}
                  </a>
                </li>
                <li class="mb-2">
                  <a href="#" class="text-light text-decoration-none">
                    <i class="bi bi-arrow-right me-2"></i>{{ languageService.getTranslation('aboutUs') }}
                  </a>
                </li>
              </ul>
            </div>
            <div class="col-md-4 mb-4">
              <h6 class="fw-bold mb-3">{{ languageService.getTranslation('contact') }}</h6>
              <p class="text-light mb-2">
                <i class="bi bi-envelope me-2"></i>info@stockinsights.com
              </p>
              <p class="text-light">
                <i class="bi bi-telephone me-2"></i>+20 123 456 7890
              </p>
            </div>
          </div>
          <hr class="border-light">
          <div class="text-center">
            <p class="mb-0 text-light">&copy; 2024 StockInsights. {{ languageService.getTranslation('rightsReserved') }}</p>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LandingComponent implements OnInit {

  constructor(
    public languageService: LanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {}


  goToInsights(): void {
    this.router.navigate(['/insights']);
  }

  goToStocks(): void {
    this.router.navigate(['/stocks']);
  }
}

