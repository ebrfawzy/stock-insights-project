import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { StockService, StockDetail } from '../../services/stock.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-stock-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-body-secondary min-vh-100" [attr.dir]="languageService.getCurrentLanguage()().direction">

      <!-- Main Content -->
      <main class="py-4">
        <div class="container-fluid">
          <!-- Breadcrumb -->
          <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <a routerLink="/" class="text-decoration-none">
                  <i class="bi bi-house-door me-1"></i>Home
                </a>
              </li>
              <li class="breadcrumb-item">
                <a routerLink="/stocks" class="text-decoration-none">
                  <i class="bi bi-list me-1"></i>Stocks
                </a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">{{ stock?.symbol }}</li>
            </ol>
          </nav>

          <!-- Hero Section -->
          <div class="card shadow mb-4" *ngIf="stock">
            <div class="card-body">
              <div class="row">
                <div class="col-lg-8">
                  <div class="d-flex flex-wrap gap-2 mb-3">
                    <span class="badge bg-primary">{{ stock.exchange }}</span>
                    <span class="badge bg-secondary">{{ stock.sector }}</span>
                  </div>
                  <h1 class="display-6 text-primary mb-3">{{ stock.name }}</h1>
                  <div class="d-flex flex-wrap gap-3 mb-3">
                    <span class="fw-bold text-primary">{{ stock.symbol }}</span>
                    <span class="text-body-secondary">{{ stock.industry }}</span>
                    <span class="text-body-secondary">
                      <i class="bi bi-geo-alt me-1"></i>{{ stock.country }}
                    </span>
                  </div>
                  <p class="text-body-secondary" *ngIf="stock.description">{{ stock.description }}</p>
                </div>
                
                <div class="col-lg-4">
                  <div class="text-center text-lg-end">
                    <div class="display-4 fw-bold text-primary mb-2">
                      {{ stock.price | currency:'EGP':'symbol':'1.2-2' }}
                    </div>
                    <div class="mb-3" [class.text-success]="stock.change_percent > 0" [class.text-danger]="stock.change_percent <= 0">
                      <i class="bi fs-5" [class.bi-arrow-up]="stock.change_percent > 0" [class.bi-arrow-down]="stock.change_percent <= 0"></i>
                      <span class="fs-5 fw-semibold">{{ stock.change_percent > 0 ? '+' : '' }}{{ stock.change_percent | number:'1.2-2' }}%</span>
                      <span class="text-muted ms-2">({{ stock.change | currency:'EGP':'symbol':'1.2-2' }})</span>
                    </div>
                    <div class="row g-2 text-center">
                      <div class="col-4">
                        <div class="small text-muted">Open</div>
                        <div class="fw-semibold">{{ stock.open_price | currency:'EGP':'symbol':'1.2-2' }}</div>
                      </div>
                      <div class="col-4">
                        <div class="small text-muted">High</div>
                        <div class="fw-semibold text-success">{{ stock.high | currency:'EGP':'symbol':'1.2-2' }}</div>
                      </div>
                      <div class="col-4">
                        <div class="small text-muted">Low</div>
                        <div class="fw-semibold text-danger">{{ stock.low | currency:'EGP':'symbol':'1.2-2' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Key Metrics -->
          <div class="row mb-4" *ngIf="stock">
            <div class="col-12">
              <h2 class="text-primary mb-4">Key Metrics</h2>
              <div class="row g-4">
                <div class="col-md-6 col-lg-2">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">{{ languageService.getTranslation('marketCap') }}</div>
                      <div class="h5 fw-bold text-primary">{{ formatCurrency(stock.market_capitalization || 0) }}</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-2">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">{{ languageService.getTranslation('peRatio') }}</div>
                      <div class="h5 fw-bold text-info">{{ stock.price_to_earnings_ratio_ttm | number:'1.1-1' }}</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-2">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">{{ languageService.getTranslation('volume') }}</div>
                      <div class="h5 fw-bold text-warning">{{ formatNumber(stock.volume || 0) }}</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-2">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">{{ languageService.getTranslation('dividendYield') }}</div>
                      <div class="h5 fw-bold text-success">{{ stock.dividend_yield_forward | number:'1.2-2' }}%</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-2">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">{{ languageService.getTranslation('technicalRating') }}</div>
                      <div class="h5 fw-bold" [class.text-success]="stock.technical_rating > 0" [class.text-danger]="stock.technical_rating <= 0">
                        {{ stock.technical_rating | number:'1.1-1' }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-2">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">Beta</div>
                      <div class="h5 fw-bold text-secondary">{{ stock.one_year_beta | number:'1.2-2' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Performance Section -->
          <div class="row mb-4" *ngIf="stock">
            <div class="col-12">
              <h2 class="text-primary mb-4">Performance</h2>
              <div class="row g-4">
                <div class="col-md-4">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">{{ languageService.getTranslation('weeklyPerformance') }}</div>
                      <div class="h4 fw-bold" [class.text-success]="stock.weekly_performance > 0" [class.text-danger]="stock.weekly_performance <= 0">
                        <i class="bi me-1" [class.bi-arrow-up]="stock.weekly_performance > 0" [class.bi-arrow-down]="stock.weekly_performance <= 0"></i>
                        {{ stock.weekly_performance | number:'1.2-2' }}%
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">{{ languageService.getTranslation('monthlyPerformance') }}</div>
                      <div class="h4 fw-bold" [class.text-success]="stock.monthly_performance > 0" [class.text-danger]="stock.monthly_performance <= 0">
                        <i class="bi me-1" [class.bi-arrow-up]="stock.monthly_performance > 0" [class.bi-arrow-down]="stock.monthly_performance <= 0"></i>
                        {{ stock.monthly_performance | number:'1.2-2' }}%
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">{{ languageService.getTranslation('yearlyPerformance') }}</div>
                      <div class="h4 fw-bold" [class.text-success]="stock.yearly_performance > 0" [class.text-danger]="stock.yearly_performance <= 0">
                        <i class="bi me-1" [class.bi-arrow-up]="stock.yearly_performance > 0" [class.bi-arrow-down]="stock.yearly_performance <= 0"></i>
                        {{ stock.yearly_performance | number:'1.2-2' }}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Technical Indicators -->
          <div class="row mb-4" *ngIf="stock">
            <div class="col-12">
              <h2 class="text-primary mb-4">{{ languageService.getTranslation('technicalIndicators') }}</h2>
              <div class="row g-4">
                <div class="col-md-6 col-lg-3">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <h5 class="card-title text-primary">{{ languageService.getTranslation('rsi') }}</h5>
                      <div class="display-6 fw-bold mb-2">{{ stock.relative_strength_index_14 | number:'1.1-1' }}</div>
                      <span class="badge" [class.bg-danger]="(stock.relative_strength_index_14 || 0) > 70" 
                            [class.bg-success]="(stock.relative_strength_index_14 || 0) < 30" 
                            [class.bg-secondary]="(stock.relative_strength_index_14 || 0) >= 30 && (stock.relative_strength_index_14 || 0) <= 70">
                        {{ getRSIStatus(stock.relative_strength_index_14 || 0) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-3">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <h5 class="card-title text-primary">{{ languageService.getTranslation('macd') }}</h5>
                      <div class="display-6 fw-bold mb-2">{{ stock.macd_level_12_26 | number:'1.3-3' }}</div>
                      <span class="badge" [class.bg-success]="(stock.macd_level_12_26 || 0) > (stock.macd_signal_12_26 || 0)" 
                            [class.bg-danger]="(stock.macd_level_12_26 || 0) <= (stock.macd_signal_12_26 || 0)">
                        {{ (stock.macd_level_12_26 || 0) > (stock.macd_signal_12_26 || 0) ? 'Bullish' : 'Bearish' }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-3">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <h5 class="card-title text-primary">Stochastic</h5>
                      <div class="display-6 fw-bold mb-2">{{ stock.stochastic_k_14_3_3 | number:'1.1-1' }}</div>
                      <span class="badge" [class.bg-danger]="(stock.stochastic_k_14_3_3 || 0) > 80" 
                            [class.bg-success]="(stock.stochastic_k_14_3_3 || 0) < 20" 
                            [class.bg-secondary]="(stock.stochastic_k_14_3_3 || 0) >= 20 && (stock.stochastic_k_14_3_3 || 0) <= 80">
                        {{ getStochasticStatus(stock.stochastic_k_14_3_3 || 0) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-3">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <h5 class="card-title text-primary">Williams %R</h5>
                      <div class="display-6 fw-bold mb-2">{{ stock.williams_percent_range_14 | number:'1.1-1' }}</div>
                      <span class="badge" [class.bg-danger]="(stock.williams_percent_range_14 || 0) > -20" 
                            [class.bg-success]="(stock.williams_percent_range_14 || 0) < -80" 
                            [class.bg-secondary]="(stock.williams_percent_range_14 || 0) >= -80 && (stock.williams_percent_range_14 || 0) <= -20">
                        {{ getWilliamsStatus(stock.williams_percent_range_14 || 0) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Moving Averages -->
          <div class="row mb-4" *ngIf="stock">
            <div class="col-12">
              <h2 class="text-primary mb-4">{{ languageService.getTranslation('movingAverages') }}</h2>
              <div class="card shadow">
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6 col-lg-2">
                      <div class="text-center">
                        <div class="small text-muted mb-1">SMA 5</div>
                        <div class="fw-bold">{{ stock.simple_moving_average_5 | currency:'EGP':'symbol':'1.2-2' }}</div>
                      </div>
                    </div>
                    <div class="col-md-6 col-lg-2">
                      <div class="text-center">
                        <div class="small text-muted mb-1">SMA 10</div>
                        <div class="fw-bold">{{ stock.simple_moving_average_10 | currency:'EGP':'symbol':'1.2-2' }}</div>
                      </div>
                    </div>
                    <div class="col-md-6 col-lg-2">
                      <div class="text-center">
                        <div class="small text-muted mb-1">SMA 20</div>
                        <div class="fw-bold">{{ stock.simple_moving_average_20 | currency:'EGP':'symbol':'1.2-2' }}</div>
                      </div>
                    </div>
                    <div class="col-md-6 col-lg-2">
                      <div class="text-center">
                        <div class="small text-muted mb-1">SMA 50</div>
                        <div class="fw-bold">{{ stock.simple_moving_average_50 | currency:'EGP':'symbol':'1.2-2' }}</div>
                      </div>
                    </div>
                    <div class="col-md-6 col-lg-2">
                      <div class="text-center">
                        <div class="small text-muted mb-1">SMA 100</div>
                        <div class="fw-bold">{{ stock.simple_moving_average_100 | currency:'EGP':'symbol':'1.2-2' }}</div>
                      </div>
                    </div>
                    <div class="col-md-6 col-lg-2">
                      <div class="text-center">
                        <div class="small text-muted mb-1">SMA 200</div>
                        <div class="fw-bold">{{ stock.simple_moving_average_200 | currency:'EGP':'symbol':'1.2-2' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Performance Metrics -->
          <div class="row mb-4" *ngIf="stock">
            <div class="col-12">
              <h2 class="text-primary mb-4">Additional Performance</h2>
              <div class="row g-4">
                <div class="col-md-6 col-xl-2">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">YTD Performance</div>
                      <div class="h5 fw-bold" [class.text-success]="(stock.ytd_performance || 0) > 0" [class.text-danger]="(stock.ytd_performance || 0) <= 0">
                        <i class="bi me-1" [class.bi-arrow-up]="(stock.ytd_performance || 0) > 0" [class.bi-arrow-down]="(stock.ytd_performance || 0) <= 0"></i>
                        {{ stock.ytd_performance | number:'1.2-2' }}%
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-xl-2">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">3 Month Performance</div>
                      <div class="h5 fw-bold" [class.text-success]="(stock.three_month_performance || 0) > 0" [class.text-danger]="(stock.three_month_performance || 0) <= 0">
                        <i class="bi me-1" [class.bi-arrow-up]="(stock.three_month_performance || 0) > 0" [class.bi-arrow-down]="(stock.three_month_performance || 0) <= 0"></i>
                        {{ stock.three_month_performance | number:'1.2-2' }}%
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-xl-2">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">6 Month Performance</div>
                      <div class="h5 fw-bold" [class.text-success]="(stock.six_month_performance || 0) > 0" [class.text-danger]="(stock.six_month_performance || 0) <= 0">
                        <i class="bi me-1" [class.bi-arrow-up]="(stock.six_month_performance || 0) > 0" [class.bi-arrow-down]="(stock.six_month_performance || 0) <= 0"></i>
                        {{ stock.six_month_performance | number:'1.2-2' }}%
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-xl-2">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">5 Year Performance</div>
                      <div class="h5 fw-bold" [class.text-success]="(stock.five_year_performance || 0) > 0" [class.text-danger]="(stock.five_year_performance || 0) <= 0">
                        <i class="bi me-1" [class.bi-arrow-up]="(stock.five_year_performance || 0) > 0" [class.bi-arrow-down]="(stock.five_year_performance || 0) <= 0"></i>
                        {{ stock.five_year_performance | number:'1.2-2' }}%
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-xl-2">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">All Time Performance</div>
                      <div class="h5 fw-bold" [class.text-success]="(stock.all_time_performance || 0) > 0" [class.text-danger]="(stock.all_time_performance || 0) <= 0">
                        <i class="bi me-1" [class.bi-arrow-up]="(stock.all_time_performance || 0) > 0" [class.bi-arrow-down]="(stock.all_time_performance || 0) <= 0"></i>
                        {{ stock.all_time_performance | number:'1.2-2' }}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- High/Low Records -->
          <div class="row mb-4" *ngIf="stock">
            <div class="col-12">
              <h2 class="text-primary mb-4">High/Low Records</h2>
              <div class="row g-4">
                <div class="col-md-6 col-lg-4">
                  <div class="card shadow h-100 border-0">
                    <div class="card-header bg-primary text-white">
                      <h6 class="mb-0">All Time</h6>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-6">
                          <div class="text-muted small">High:</div>
                          <div class="fw-bold text-success">{{ stock.all_time_high | currency:'EGP':'symbol':'1.2-2' }}</div>
                        </div>
                        <div class="col-6">
                          <div class="text-muted small">Low:</div>
                          <div class="fw-bold text-danger">{{ stock.all_time_low | currency:'EGP':'symbol':'1.2-2' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4">
                  <div class="card shadow h-100 border-0">
                    <div class="card-header bg-secondary text-white">
                      <h6 class="mb-0">52 Week</h6>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-6">
                          <div class="text-muted small">High:</div>
                          <div class="fw-bold text-success">{{ stock.fifty_two_week_high | currency:'EGP':'symbol':'1.2-2' }}</div>
                        </div>
                        <div class="col-6">
                          <div class="text-muted small">Low:</div>
                          <div class="fw-bold text-danger">{{ stock.fifty_two_week_low | currency:'EGP':'symbol':'1.2-2' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4">
                  <div class="card shadow h-100 border-0">
                    <div class="card-header bg-info text-white">
                      <h6 class="mb-0">6 Month</h6>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-6">
                          <div class="text-muted small">High:</div>
                          <div class="fw-bold text-success">{{ stock.six_month_high | currency:'EGP':'symbol':'1.2-2' }}</div>
                        </div>
                        <div class="col-6">
                          <div class="text-muted small">Low:</div>
                          <div class="fw-bold text-danger">{{ stock.six_month_low | currency:'EGP':'symbol':'1.2-2' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Volume Information -->
          <div class="row mb-4" *ngIf="stock">
            <div class="col-12">
              <h2 class="text-primary mb-4">Volume Information</h2>
              <div class="card shadow">
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6 col-lg-2">
                      <div class="text-center">
                        <div class="small text-muted mb-1">Volume</div>
                        <div class="fw-bold">{{ formatNumber(stock.volume || 0) }}</div>
                      </div>
                    </div>
                    <div class="col-md-6 col-lg-2">
                      <div class="text-center">
                        <div class="small text-muted mb-1">Volume Price</div>
                        <div class="fw-bold">{{ stock.volume_price | currency:'EGP':'symbol':'1.2-2' }}</div>
                      </div>
                    </div>
                    <div class="col-md-6 col-lg-2">
                      <div class="text-center">
                        <div class="small text-muted mb-1">VWAP</div>
                        <div class="fw-bold">{{ stock.volume_weighted_average_price | currency:'EGP':'symbol':'1.2-2' }}</div>
                      </div>
                    </div>
                    <div class="col-md-6 col-lg-2">
                      <div class="text-center">
                        <div class="small text-muted mb-1">Relative Volume</div>
                        <div class="fw-bold">{{ stock.relative_volume | number:'1.2-2' }}</div>
                      </div>
                    </div>
                    <div class="col-md-6 col-lg-2">
                      <div class="text-center">
                        <div class="small text-muted mb-1">Rel Vol at Time</div>
                        <div class="fw-bold">{{ stock.relative_volume_at_time | number:'1.2-2' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Valuation Ratios -->
          <div class="row mb-4" *ngIf="stock">
            <div class="col-12">
              <h2 class="text-primary mb-4">Valuation Ratios</h2>
              <div class="card shadow">
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-6 col-lg-3">
                      <div class="text-center">
                        <div class="small text-muted mb-1">P/E Ratio (TTM)</div>
                        <div class="fw-bold">{{ stock.price_to_earnings_ratio_ttm | number:'1.2-2' }}</div>
                      </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                      <div class="text-center">
                        <div class="small text-muted mb-1">P/B Ratio (FY)</div>
                        <div class="fw-bold">{{ stock.price_to_book_fy | number:'1.2-2' }}</div>
                      </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                      <div class="text-center">
                        <div class="small text-muted mb-1">P/B Ratio (MRQ)</div>
                        <div class="fw-bold">{{ stock.price_to_book_mrq | number:'1.2-2' }}</div>
                      </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                      <div class="text-center">
                        <div class="small text-muted mb-1">P/S Ratio (FY)</div>
                        <div class="fw-bold">{{ stock.price_to_sales_fy | number:'1.2-2' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Technical Ratings -->
          <div class="row mb-4" *ngIf="stock">
            <div class="col-12">
              <h2 class="text-primary mb-4">Technical Ratings</h2>
              <div class="row g-4">
                <div class="col-md-4">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">Technical Rating</div>
                      <div class="display-6 fw-bold" [class.text-success]="(stock.technical_rating || 0) > 0" [class.text-danger]="(stock.technical_rating || 0) <= 0">
                        {{ stock.technical_rating | number:'1.1-1' }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">Oscillators Rating</div>
                      <div class="display-6 fw-bold" [class.text-success]="(stock.oscillators_rating || 0) > 0" [class.text-danger]="(stock.oscillators_rating || 0) <= 0">
                        {{ stock.oscillators_rating | number:'1.1-1' }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card shadow h-100 border-0">
                    <div class="card-body text-center">
                      <div class="text-body-secondary small mb-1">Moving Averages Rating</div>
                      <div class="display-6 fw-bold" [class.text-success]="(stock.moving_averages_rating || 0) > 0" [class.text-danger]="(stock.moving_averages_rating || 0) <= 0">
                        {{ stock.moving_averages_rating | number:'1.1-1' }}
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
            <button class="btn btn-danger" (click)="loadStock()">
              <i class="bi bi-arrow-clockwise me-1"></i>{{ languageService.getTranslation('refresh') }}
            </button>
          </div>
        </div>
      </main>
    </div>
  `
})
export class StockDetailComponent implements OnInit {
  stock: StockDetail | null = null;
  loading = false;
  error: string | null = null;
  symbol: string = '';

  constructor(
    private stockService: StockService,
    public languageService: LanguageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.symbol = params['symbol'];
      console.log('Stock symbol from route:', this.symbol); // Debug log
      if (this.symbol) {
        this.loadStock();
      } else {
        this.error = 'No stock symbol provided';
        this.loading = false;
      }
    });
  }

  loadStock(): void {
    if (!this.symbol) return;

    this.loading = true;
    this.error = null;

    console.log('Loading stock details for symbol:', this.symbol); // Debug log

    this.stockService.getStockDetail(this.symbol).subscribe({
      next: (response) => {
        console.log('Stock details API Response:', response); // Debug log
        
        if (response && response.success) {
          this.stock = response.data;
          console.log('Stock details loaded successfully, cached:', response.cached); // Debug log
        } else {
          console.error('Failed to load stock details:', response);
          this.error = 'Failed to load stock details';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Stock detail error:', err); // Debug log
        this.error = 'Error loading stock details: ' + err.message;
        this.loading = false;
      }
    });
  }


  formatCurrency(value: number): string {
    if (value >= 1e9) {
      return (value / 1e9).toFixed(1) + 'B';
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + 'M';
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + 'K';
    }
    return value.toFixed(0);
  }

  formatNumber(value: number): string {
    if (value >= 1e9) {
      return (value / 1e9).toFixed(1) + 'B';
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + 'M';
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + 'K';
    }
    return value.toFixed(0);
  }

  getRSIStatus(rsi: number): string {
    if (rsi > 70) return 'Overbought';
    if (rsi < 30) return 'Oversold';
    return 'Neutral';
  }

  getStochasticStatus(stoch: number): string {
    if (stoch > 80) return 'Overbought';
    if (stoch < 20) return 'Oversold';
    return 'Neutral';
  }

  getWilliamsStatus(williams: number): string {
    if (williams > -20) return 'Overbought';
    if (williams < -80) return 'Oversold';
    return 'Neutral';
  }

  getCCIStatus(value: number): string {
    if (value > 100) return 'Overbought';
    if (value < -100) return 'Oversold';
    return 'Neutral';
  }

  getUltimateOscillatorStatus(value: number): string {
    if (value > 70) return 'Overbought';
    if (value < 30) return 'Oversold';
    return 'Neutral';
  }
}

