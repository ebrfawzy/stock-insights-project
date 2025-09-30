import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StockService, StockInsights, Stock } from '../../services/stock.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-body-secondary min-vh-100" [attr.dir]="languageService.getCurrentLanguage()().direction">

      <!-- Main Content -->
      <main class="py-4">
        <div class="container-fluid">
          <!-- Page Header -->
          <div class="row mb-4">
            <div class="col-lg-8">
              <h1 class="display-5 text-primary mb-2">{{ languageService.getTranslation('marketInsights') }}</h1>
              <p class="lead text-body-secondary">{{ languageService.getTranslation('insightsSubtitle') }}</p>
            </div>
            <div class="col-lg-4 d-flex align-items-center justify-content-lg-end">
              <button class="btn btn-primary btn-lg" (click)="refreshData()" [disabled]="loading">
                <i class="bi bi-arrow-clockwise me-2"></i>
                {{ loading ? languageService.getTranslation('loading') : languageService.getTranslation('refresh') }}
              </button>
            </div>
          </div>

          <!-- Market Overview -->
          <div class="row mb-5" *ngIf="insights">
            <div class="col-12">
              <h2 class="text-primary mb-4">{{ languageService.getTranslation('marketOverview') }}</h2>
              <div class="row g-4">
                <div class="col-md-6 col-lg-3">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="display-6 fw-bold text-primary mb-2">{{ insights.total_stocks }}</div>
                      <div class="text-body-secondary">{{ languageService.getTranslation('totalStocks') }}</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-3">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="display-6 fw-bold text-success mb-2">{{ formatCurrency(insights.market_overview.total_market_cap) }}</div>
                      <div class="text-body-secondary">{{ languageService.getTranslation('totalMarketCap') }}</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-3">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="display-6 fw-bold text-info mb-2">{{ insights.market_overview.average_pe_ratio | number:'1.1-1' }}</div>
                      <div class="text-body-secondary">{{ languageService.getTranslation('averagePERatio') }}</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-3">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="display-6 fw-bold text-warning mb-2">{{ formatNumber(insights.market_overview.average_volume) }}</div>
                      <div class="text-body-secondary">{{ languageService.getTranslation('averageVolume') }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Insights Grid -->
          <div class="row g-4" *ngIf="insights && !loading">
            <!-- Top Bullish Stocks -->
            <div class="col-lg-6">
              <div class="card shadow h-100">
                <div class="card-header bg-success text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-graph-up me-2"></i>
                    {{ languageService.getTranslation('topBullish') }}
                  </h5>
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center" 
                         *ngFor="let stock of insights.top_bullish; let i = index"
                         [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                         [class.disabled]="!stock.symbol || stock.symbol === 'N/A'"
                         style="cursor: pointer;">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-primary me-3">{{ i + 1 }}</span>
                        <div>
                          <div class="fw-bold">{{ stock.symbol || 'N/A' }}</div>
                          <small class="text-body-secondary">{{ stock.name || languageService.getTranslation('unknown') }}</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                        <div class="small" [class.text-success]="stock.change_percent > 0" [class.text-danger]="stock.change_percent <= 0">
                          <i class="bi" [class.bi-arrow-up]="stock.change_percent > 0" [class.bi-arrow-down]="stock.change_percent <= 0"></i>
                          {{ stock.change_percent | number:'1.2-2' }}%
                        </div>
                        <div class="small text-muted">{{ languageService.getTranslation('rating') }}: {{ stock.technical_rating | number:'1.2-2' }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="text-center p-3" *ngIf="!insights.top_bullish || insights.top_bullish.length === 0">
                    <i class="bi bi-info-circle text-muted"></i>
                    <p class="text-muted mb-0">{{ languageService.getTranslation('noPositiveMovers') }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Top Bearish Stocks -->
            <div class="col-lg-6">
              <div class="card shadow h-100">
                <div class="card-header bg-danger text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-graph-down me-2"></i>
                    {{ languageService.getTranslation('topBearish') }}
                  </h5>
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center" 
                         *ngFor="let stock of insights.top_bearish; let i = index"
                         [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                         [class.disabled]="!stock.symbol || stock.symbol === 'N/A'"
                         style="cursor: pointer;">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-primary me-3">{{ i + 1 }}</span>
                        <div>
                          <div class="fw-bold">{{ stock.symbol || 'N/A' }}</div>
                          <small class="text-body-secondary">{{ stock.name || languageService.getTranslation('unknown') }}</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                        <div class="small" [class.text-success]="stock.change_percent > 0" [class.text-danger]="stock.change_percent <= 0">
                          <i class="bi" [class.bi-arrow-up]="stock.change_percent > 0" [class.bi-arrow-down]="stock.change_percent <= 0"></i>
                          {{ stock.change_percent | number:'1.2-2' }}%
                        </div>
                        <div class="small text-muted">{{ languageService.getTranslation('rating') }}: {{ stock.technical_rating | number:'1.2-2' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Overpriced Stocks -->
            <div class="col-lg-6">
              <div class="card shadow h-100">
                <div class="card-header bg-warning text-dark">
                  <h5 class="mb-0">
                    <i class="bi bi-cash-coin me-2"></i>
                    {{ languageService.getTranslation('overpriced') }}
                  </h5>
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center" 
                         *ngFor="let stock of insights.overpriced; let i = index"
                         [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                         [class.disabled]="!stock.symbol || stock.symbol === 'N/A'"
                         style="cursor: pointer;">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-primary me-3">{{ i + 1 }}</span>
                        <div>
                          <div class="fw-bold">{{ stock.symbol || 'N/A' }}</div>
                          <small class="text-body-secondary">{{ stock.name || 'Unknown' }}</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                        <div class="small text-muted">P/E: {{ stock.price_to_earnings_ratio_ttm | number:'1.1-1' }}</div>
                        <div class="small text-muted">P/B: {{ stock.price_to_book_mrq | number:'1.1-1' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Underpriced Stocks -->
            <div class="col-lg-6">
              <div class="card shadow h-100">
                <div class="card-header bg-info text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-gem me-2"></i>
                    {{ languageService.getTranslation('underpriced') }}
                  </h5>
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center" 
                         *ngFor="let stock of insights.underpriced; let i = index"
                         [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                         [class.disabled]="!stock.symbol || stock.symbol === 'N/A'"
                         style="cursor: pointer;">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-primary me-3">{{ i + 1 }}</span>
                        <div>
                          <div class="fw-bold">{{ stock.symbol || 'N/A' }}</div>
                          <small class="text-body-secondary">{{ stock.name || 'Unknown' }}</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                        <div class="small text-muted">P/E: {{ stock.price_to_earnings_ratio_ttm | number:'1.1-1' }}</div>
                        <div class="small text-muted">P/B: {{ stock.price_to_book_mrq | number:'1.1-1' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Volume Leaders -->
            <div class="col-lg-6">
              <div class="card shadow h-100">
                <div class="card-header bg-secondary text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-bar-chart me-2"></i>
                    {{ languageService.getTranslation('volumeLeaders') }}
                  </h5>
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center" 
                         *ngFor="let stock of insights.volume_leaders; let i = index"
                         [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                         [class.disabled]="!stock.symbol || stock.symbol === 'N/A'"
                         style="cursor: pointer;">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-primary me-3">{{ i + 1 }}</span>
                        <div>
                          <div class="fw-bold">{{ stock.symbol || 'N/A' }}</div>
                          <small class="text-body-secondary">{{ stock.name || 'Unknown' }}</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                        <div class="small text-muted">{{ languageService.getTranslation('volumeShort') }}: {{ formatNumber(stock.volume) }}</div>
                        <div class="small text-muted">{{ languageService.getTranslation('relVol') }}: {{ stock.relative_volume | number:'1.1-1' }}x</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Top Sectors Change -->
            <div class="col-lg-6">
              <div class="card shadow h-100">
                <div class="card-header bg-dark text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-building me-2"></i>
                    {{ languageService.getTranslation('topSectorsChange') }}
                  </h5>
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center" 
                         *ngFor="let sector of insights.top_sectors_change; let i = index">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-primary me-3">{{ i + 1 }}</span>
                        <div class="fw-semibold">{{ sector.sector || languageService.getTranslation('unknown') }}</div>
                      </div>
                      <div class="text-end">
                        <span class="badge" [class.bg-success]="sector.change > 0" [class.bg-danger]="sector.change <= 0">
                          <i class="bi" [class.bi-arrow-up]="sector.change > 0" [class.bi-arrow-down]="sector.change <= 0"></i>
                          {{ sector.change | number:'1.2-2' }}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="text-center p-3" *ngIf="!insights.top_sectors_change || insights.top_sectors_change.length === 0">
                    <i class="bi bi-info-circle text-muted"></i>
                    <p class="text-muted mb-0">{{ languageService.getTranslation('noSectorData') }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Top +ve Movers -->
            <div class="col-lg-6">
              <div class="card shadow h-100">
                <div class="card-header bg-success text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-graph-up me-2"></i>
                    {{ languageService.getTranslation('topPositiveMovers') }}
                  </h5>
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center" 
                         *ngFor="let stock of insights.top_positive_movers; let i = index"
                         [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                         [class.disabled]="!stock.symbol || stock.symbol === 'N/A'"
                         style="cursor: pointer;">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-primary me-3">{{ i + 1 }}</span>
                        <div>
                          <div class="fw-bold">{{ stock.symbol || 'N/A' }}</div>
                          <small class="text-body-secondary">{{ stock.name || 'Unknown' }}</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                        <div class="small" [class.text-success]="stock.change_percent > 0" [class.text-danger]="stock.change_percent <= 0">
                          <i class="bi" [class.bi-arrow-up]="stock.change_percent > 0" [class.bi-arrow-down]="stock.change_percent <= 0"></i>
                          {{ stock.change_percent | number:'1.2-2' }}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-center p-3" *ngIf="!insights.top_positive_movers || insights.top_positive_movers.length === 0">
                    <i class="bi bi-info-circle text-muted"></i>
                    <p class="text-muted mb-0">{{ languageService.getTranslation('noPositiveMovers') }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Top -ve Movers -->
            <div class="col-lg-6">
              <div class="card shadow h-100">
                <div class="card-header bg-danger text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-graph-down me-2"></i>
                    {{ languageService.getTranslation('topNegativeMovers') }}
                  </h5>
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center" 
                         *ngFor="let stock of insights.top_negative_movers; let i = index"
                         [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                         [class.disabled]="!stock.symbol || stock.symbol === 'N/A'"
                         style="cursor: pointer;">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-primary me-3">{{ i + 1 }}</span>
                        <div>
                          <div class="fw-bold">{{ stock.symbol || 'N/A' }}</div>
                          <small class="text-body-secondary">{{ stock.name || 'Unknown' }}</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                        <div class="small" [class.text-success]="stock.change_percent > 0" [class.text-danger]="stock.change_percent <= 0">
                          <i class="bi" [class.bi-arrow-up]="stock.change_percent > 0" [class.bi-arrow-down]="stock.change_percent <= 0"></i>
                          {{ stock.change_percent | number:'1.2-2' }}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-center p-3" *ngIf="!insights.top_negative_movers || insights.top_negative_movers.length === 0">
                    <i class="bi bi-info-circle text-muted"></i>
                    <p class="text-muted mb-0">{{ languageService.getTranslation('noNegativeMovers') }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dividend Stocks -->
            <div class="col-lg-6">
              <div class="card shadow h-100">
                <div class="card-header bg-primary text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-cash-stack me-2"></i>
                    {{ languageService.getTranslation('dividendStocks') }}
                  </h5>
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center" 
                         *ngFor="let stock of insights.dividend_stocks; let i = index"
                         [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                         [class.disabled]="!stock.symbol || stock.symbol === 'N/A'"
                         style="cursor: pointer;">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-primary me-3">{{ i + 1 }}</span>
                        <div>
                          <div class="fw-bold">{{ stock.symbol || 'N/A' }}</div>
                          <small class="text-body-secondary">{{ stock.name || 'Unknown' }}</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                        <div class="small text-muted">Yield: {{ stock.dividend_yield_forward | number:'1.2-2' }}%</div>
                        <div class="small text-muted">DPS: {{ stock.dividends_per_share_fy | currency:'EGP':'symbol':'1.2-2' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Momentum Stocks -->
            <div class="col-lg-6">
              <div class="card shadow h-100">
                <div class="card-header bg-warning text-dark">
                  <h5 class="mb-0">
                    <i class="bi bi-lightning me-2"></i>
                    {{ languageService.getTranslation('momentumStocks') }}
                  </h5>
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center" 
                         *ngFor="let stock of insights.momentum_stocks; let i = index"
                         [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                         [class.disabled]="!stock.symbol || stock.symbol === 'N/A'"
                         style="cursor: pointer;">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-primary me-3">{{ i + 1 }}</span>
                        <div>
                          <div class="fw-bold">{{ stock.symbol || 'N/A' }}</div>
                          <small class="text-body-secondary">{{ stock.name || 'Unknown' }}</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                        <div class="small text-muted">Momentum: {{ stock.momentum_10 | number:'1.2-2' }}</div>
                        <div class="small" [class.text-success]="stock.change_percent > 0" [class.text-danger]="stock.change_percent <= 0">
                          Change: {{ stock.change_percent | number:'1.2-2' }}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Growth Stocks -->
            <div class="col-lg-6">
              <div class="card shadow h-100">
                <div class="card-header bg-success text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-rocket-takeoff me-2"></i>
                    {{ languageService.getTranslation('growthStocks') }}
                  </h5>
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center" 
                         *ngFor="let stock of insights.growth_stocks; let i = index"
                         [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                         [class.disabled]="!stock.symbol || stock.symbol === 'N/A'"
                         style="cursor: pointer;">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-primary me-3">{{ i + 1 }}</span>
                        <div>
                          <div class="fw-bold">{{ stock.symbol || 'N/A' }}</div>
                          <small class="text-body-secondary">{{ stock.name || 'Unknown' }}</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                        <div class="small text-muted">Revenue Growth: {{ stock.revenue_ttm_yoy_growth | number:'1.2-2' }}%</div>
                        <div class="small text-muted">EPS Growth: {{ stock.eps_diluted_ttm_yoy_growth | number:'1.2-2' }}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Best Short Term -->
            <div class="col-lg-6">
              <div class="card shadow h-100">
                <div class="card-header bg-info text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-speedometer2 me-2"></i>
                    {{ languageService.getTranslation('bestShortTerm') }}
                  </h5>
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center" 
                         *ngFor="let stock of insights.best_short_term; let i = index"
                         [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                         [class.disabled]="!stock.symbol || stock.symbol === 'N/A'"
                         style="cursor: pointer;">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-primary me-3">{{ i + 1 }}</span>
                        <div>
                          <div class="fw-bold">{{ stock.symbol || 'N/A' }}</div>
                          <small class="text-body-secondary">{{ stock.name || 'Unknown' }}</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                        <div class="small text-muted">Weekly: {{ stock.weekly_performance | number:'1.2-2' }}%</div>
                        <div class="small text-muted">RSI (7): {{ stock.relative_strength_index_7 | number:'1.1-1' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Best Medium Term -->
            <div class="col-lg-6">
              <div class="card shadow h-100">
                <div class="card-header bg-secondary text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-calendar-month me-2"></i>
                    {{ languageService.getTranslation('bestMediumTerm') }}
                  </h5>
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center" 
                         *ngFor="let stock of insights.best_medium_term; let i = index"
                         [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                         [class.disabled]="!stock.symbol || stock.symbol === 'N/A'"
                         style="cursor: pointer;">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-primary me-3">{{ i + 1 }}</span>
                        <div>
                          <div class="fw-bold">{{ stock.symbol || 'N/A' }}</div>
                          <small class="text-body-secondary">{{ stock.name || 'Unknown' }}</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                        <div class="small text-muted">Monthly: {{ stock.monthly_performance | number:'1.2-2' }}%</div>
                        <div class="small text-muted" *ngIf="stock.change_1m_percent">1M Change: {{ stock.change_1m_percent | number:'1.2-2' }}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Best Long Term -->
            <div class="col-lg-6">
              <div class="card shadow h-100">
                <div class="card-header bg-dark text-white">
                  <h5 class="mb-0">
                    <i class="bi bi-bullseye me-2"></i>
                    {{ languageService.getTranslation('bestLongTerm') }}
                  </h5>
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center" 
                         *ngFor="let stock of insights.best_long_term; let i = index"
                         [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                         [class.disabled]="!stock.symbol || stock.symbol === 'N/A'"
                         style="cursor: pointer;">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-primary me-3">{{ i + 1 }}</span>
                        <div>
                          <div class="fw-bold">{{ stock.symbol || 'N/A' }}</div>
                          <small class="text-body-secondary">{{ stock.name || 'Unknown' }}</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                        <div class="small text-muted">Yearly: {{ stock.yearly_performance | number:'1.2-2' }}%</div>
                        <div class="small text-muted">ROE: {{ stock.return_on_equity_ttm | number:'1.1-1' }}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div class="text-center py-5" *ngIf="loading">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-body-secondary">{{ languageService.getTranslation('loading') }}</p>
          </div>

          <!-- Error State -->
          <div class="alert alert-danger text-center" *ngIf="error">
            <i class="bi bi-exclamation-triangle-fill fs-1 text-danger mb-3"></i>
            <h4 class="alert-heading">{{ languageService.getTranslation('error') }}</h4>
            <p class="mb-3">{{ error }}</p>
            <button class="btn btn-danger" (click)="refreshData()">
              <i class="bi bi-arrow-clockwise me-1"></i>{{ languageService.getTranslation('refresh') }}
            </button>
          </div>
        </div>
      </main>
    </div>
  `
})
export class InsightsComponent implements OnInit {
  insights: StockInsights | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private stockService: StockService,
    public languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.loadInsights();
  }

  loadInsights(): void {
    this.loading = true;
    this.error = null;

    this.stockService.getStockInsights().subscribe({
      next: (response) => {
        console.log('Insights API Response:', response); // Debug log

        if (response && response.success && response.data) {
          // Transform the data to match expected structure
          this.insights = this.transformInsightsData(response.data);
          console.log('Transformed insights:', this.insights); // Debug log
          console.log('Insights loaded successfully, cached:', response.cached);
        } else {
          console.error('Failed to load insights:', response);
          this.error = 'Failed to load insights';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Insights API Error:', err); // Debug log
        this.error = 'Error loading insights: ' + err.message;
        this.loading = false;
      }
    });
  }

  refreshData(): void {
    this.loadInsights();
  }

  transformInsightsData(data: any): StockInsights {
    // Transform the backend data to match frontend expectations
    return {
      timestamp: data.timestamp || new Date().toISOString(),
      total_stocks: data.total_stocks || 0,
      market_overview: {
        total_market_cap: data.market_overview?.total_market_cap || 0,
        average_pe_ratio: data.market_overview?.average_pe_ratio || 0,
        average_volume: data.market_overview?.average_volume || 0
      },
      top_bullish: this.transformStockList(data.top_bullish || []),
      top_bearish: this.transformStockList(data.top_bearish || []),
      best_short_term: this.transformStockList(data.best_short_term || []),
      best_medium_term: this.transformStockList(data.best_medium_term || []),
      best_long_term: this.transformStockList(data.best_long_term || []),
      overpriced: this.transformStockList(data.overpriced || []),
      underpriced: this.transformStockList(data.underpriced || []),
      volume_leaders: this.transformStockList(data.volume_leaders || []),
      momentum_stocks: this.transformStockList(data.momentum_stocks || []),
      dividend_stocks: this.transformStockList(data.dividend_stocks || []),
      growth_stocks: this.transformStockList(data.growth_stocks || []),
      top_positive_movers: this.transformStockList(data.top_positive_movers || data.top_positive_change || []),
      top_negative_movers: this.transformStockList(data.top_negative_movers || data.top_negative_change || []),
      top_sectors_change: data.top_sectors_change || [],
      all_stocks: this.transformStockList(data.all_stocks || [])
    };
  }

  transformStockList(stocks: any[]): Stock[] {
    return stocks.map(stock => ({
      symbol: stock.Symbol || stock.symbol || 'N/A',
      name: stock.Name || stock.name || 'Unknown',
      price: this.parseNumber(stock.Price || stock.price),
      change_percent: this.parseNumber(stock['Change %'] || stock.change_percent),
      volume: this.parseNumber(stock.Volume || stock.volume),
      market_capitalization: this.parseNumber(stock['Market Capitalization'] || stock.market_capitalization),
      price_to_earnings_ratio_ttm: this.parseNumber(stock['Price to Earnings Ratio (TTM)'] || stock.price_to_earnings_ratio_ttm),
      price_to_book_mrq: this.parseNumber(stock['Price to Book (MRQ)'] || stock.price_to_book_mrq),
      technical_rating: this.parseNumber(stock['Technical Rating'] || stock.technical_rating),
      weekly_performance: this.parseNumber(stock['Weekly Performance'] || stock.weekly_performance),
      monthly_performance: this.parseNumber(stock['Monthly Performance'] || stock.monthly_performance),
      yearly_performance: this.parseNumber(stock['Yearly Performance'] || stock.yearly_performance),
      dividend_yield_forward: this.parseNumber(stock['Dividend Yield Forward'] || stock.dividend_yield_forward),
      dividends_per_share_fy: this.parseNumber(stock['Dividends per Share (FY)'] || stock.dividends_per_share_fy),
      relative_volume: this.parseNumber(stock['Relative Volume'] || stock.relative_volume),
      momentum_10: this.parseNumber(stock['Momentum (10)'] || stock.momentum_10),
      relative_strength_index_7: this.parseNumber(stock['Relative Strength Index (7)'] || stock.relative_strength_index_7),
      revenue_ttm_yoy_growth: this.parseNumber(stock['Revenue (TTM YoY Growth)'] || stock.revenue_ttm_yoy_growth),
      eps_diluted_ttm_yoy_growth: this.parseNumber(stock['EPS Diluted (TTM YoY Growth)'] || stock.eps_diluted_ttm_yoy_growth),
      return_on_equity_ttm: this.parseNumber(stock['Return on Equity (TTM)'] || stock.return_on_equity_ttm),
      change_1m_percent: this.parseNumber(stock['Change 1M, %'] || stock.change_1m_percent),
      sector: stock.Sector || stock.sector || 'Unknown',
      industry: stock.Industry || stock.industry || 'Unknown',
      country: stock.Country || stock.country || 'Egypt',
      currency: stock.Currency || stock.currency || 'EGP',
      exchange: stock.Exchange || stock.exchange || 'EGX'
    }));
  }

  parseNumber(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  formatCurrency(value: number | null | undefined): string {
    if (value == null || isNaN(value)) {
      return '0';
    }

    if (value >= 1e9) {
      return (value / 1e9).toFixed(1) + 'B';
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + 'M';
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + 'K';
    }
    return value.toFixed(0);
  }

  formatNumber(value: number | null | undefined): string {
    if (value == null || isNaN(value)) {
      return '0';
    }

    if (value >= 1e9) {
      return (value / 1e9).toFixed(1) + 'B';
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + 'M';
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + 'K';
    }
    return value.toFixed(0);
  }
}
