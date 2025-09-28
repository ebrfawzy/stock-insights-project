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
    <div class="stock-detail-container" [class.rtl]="languageService.getCurrentLanguage()().direction === 'rtl'">

      <!-- Main Content -->
      <main class="main-content">
        <div class="container">
          <!-- Breadcrumb -->
          <nav class="breadcrumb">
            <a routerLink="/">Home</a>
            <span>></span>
            <a routerLink="/stocks">Stocks</a>
            <span>></span>
            <span>{{ stock?.symbol }}</span>
          </nav>

          <!-- Hero Section -->
          <div class="hero-section" *ngIf="stock">
            <div class="hero-content">
              <div class="stock-badge">
                <span class="exchange">{{ stock.exchange }}</span>
                <span class="sector">{{ stock.sector }}</span>
              </div>
              <h1 class="stock-name">{{ stock.name }}</h1>
              <div class="stock-meta">
                <span class="symbol">{{ stock.symbol }}</span>
                <span class="industry">{{ stock.industry }}</span>
                <span class="country">{{ stock.country }}</span>
              </div>
              <p class="stock-description" *ngIf="stock.description">{{ stock.description }}</p>
            </div>
            
            <div class="price-section">
              <div class="current-price">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
              <div class="price-change" [class.positive]="stock.change_percent > 0" [class.negative]="stock.change_percent <= 0">
                <span class="change-icon">{{ stock.change_percent > 0 ? '↗' : '↘' }}</span>
                <span class="change-value">{{ stock.change_percent > 0 ? '+' : '' }}{{ stock.change_percent | number:'1.2-2' }}%</span>
                <span class="change-amount">({{ stock.change | currency:'EGP':'symbol':'1.2-2' }})</span>
              </div>
              <div class="price-details">
                <div class="price-item">
                  <span class="label">Open:</span>
                  <span class="value">{{ stock.open_price | currency:'EGP':'symbol':'1.2-2' }}</span>
                </div>
                <div class="price-item">
                  <span class="label">High:</span>
                  <span class="value">{{ stock.high | currency:'EGP':'symbol':'1.2-2' }}</span>
                </div>
                <div class="price-item">
                  <span class="label">Low:</span>
                  <span class="value">{{ stock.low | currency:'EGP':'symbol':'1.2-2' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Key Metrics -->
          <div class="key-metrics" *ngIf="stock">
            <h2>Key Metrics</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-label">{{ languageService.getTranslation('marketCap') }}</div>
                <div class="metric-value">{{ formatCurrency(stock.market_capitalization || 0) }}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">{{ languageService.getTranslation('peRatio') }}</div>
                <div class="metric-value">{{ stock.price_to_earnings_ratio_ttm | number:'1.1-1' }}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">{{ languageService.getTranslation('volume') }}</div>
                <div class="metric-value">{{ formatNumber(stock.volume || 0) }}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">{{ languageService.getTranslation('dividendYield') }}</div>
                <div class="metric-value">{{ stock.dividend_yield_forward | number:'1.2-2' }}%</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">{{ languageService.getTranslation('technicalRating') }}</div>
                <div class="metric-value" [class.positive]="stock.technical_rating > 0" [class.negative]="stock.technical_rating <= 0">
                  {{ stock.technical_rating | number:'1.1-1' }}
                </div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Beta</div>
                <div class="metric-value">{{ stock.one_year_beta | number:'1.2-2' }}</div>
              </div>
            </div>
          </div>

          <!-- Performance Section -->
          <div class="performance-section" *ngIf="stock">
            <h2>Performance</h2>
            <div class="performance-grid">
              <div class="performance-card">
                <div class="performance-label">{{ languageService.getTranslation('weeklyPerformance') }}</div>
                <div class="performance-value" [class.positive]="stock.weekly_performance > 0" [class.negative]="stock.weekly_performance <= 0">
                  {{ stock.weekly_performance | number:'1.2-2' }}%
                </div>
              </div>
              <div class="performance-card">
                <div class="performance-label">{{ languageService.getTranslation('monthlyPerformance') }}</div>
                <div class="performance-value" [class.positive]="stock.monthly_performance > 0" [class.negative]="stock.monthly_performance <= 0">
                  {{ stock.monthly_performance | number:'1.2-2' }}%
                </div>
              </div>
              <div class="performance-card">
                <div class="performance-label">{{ languageService.getTranslation('yearlyPerformance') }}</div>
                <div class="performance-value" [class.positive]="stock.yearly_performance > 0" [class.negative]="stock.yearly_performance <= 0">
                  {{ stock.yearly_performance | number:'1.2-2' }}%
                </div>
              </div>
            </div>
          </div>

          <!-- Technical Indicators -->
          <div class="technical-indicators" *ngIf="stock">
            <h2>{{ languageService.getTranslation('technicalIndicators') }}</h2>
            <div class="indicators-grid">
              <div class="indicator-group">
                <h3>{{ languageService.getTranslation('rsi') }}</h3>
                <div class="indicator-value">{{ stock.relative_strength_index_14 | number:'1.1-1' }}</div>
                <div class="indicator-status" [class.overbought]="(stock.relative_strength_index_14 || 0) > 70" [class.oversold]="(stock.relative_strength_index_14 || 0) < 30">
                  {{ getRSIStatus(stock.relative_strength_index_14 || 0) }}
                </div>
              </div>
              <div class="indicator-group">
                <h3>{{ languageService.getTranslation('macd') }}</h3>
                <div class="indicator-value">{{ stock.macd_level_12_26 | number:'1.3-3' }}</div>
                <div class="indicator-status" [class.bullish]="(stock.macd_level_12_26 || 0) > (stock.macd_signal_12_26 || 0)" [class.bearish]="(stock.macd_level_12_26 || 0) <= (stock.macd_signal_12_26 || 0)">
                  {{ (stock.macd_level_12_26 || 0) > (stock.macd_signal_12_26 || 0) ? 'Bullish' : 'Bearish' }}
                </div>
              </div>
              <div class="indicator-group">
                <h3>Stochastic</h3>
                <div class="indicator-value">{{ stock.stochastic_k_14_3_3 | number:'1.1-1' }}</div>
                <div class="indicator-status" [class.overbought]="(stock.stochastic_k_14_3_3 || 0) > 80" [class.oversold]="(stock.stochastic_k_14_3_3 || 0) < 20">
                  {{ getStochasticStatus(stock.stochastic_k_14_3_3 || 0) }}
                </div>
              </div>
              <div class="indicator-group">
                <h3>Williams %R</h3>
                <div class="indicator-value">{{ stock.williams_percent_range_14 | number:'1.1-1' }}</div>
                <div class="indicator-status" [class.overbought]="(stock.williams_percent_range_14 || 0) > -20" [class.oversold]="(stock.williams_percent_range_14 || 0) < -80">
                  {{ getWilliamsStatus(stock.williams_percent_range_14 || 0) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Moving Averages -->
          <div class="moving-averages" *ngIf="stock">
            <h2>{{ languageService.getTranslation('movingAverages') }}</h2>
            <div class="averages-grid">
              <div class="average-item">
                <span class="average-label">SMA 5:</span>
                <span class="average-value">{{ stock.simple_moving_average_5 | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
              <div class="average-item">
                <span class="average-label">SMA 10:</span>
                <span class="average-value">{{ stock.simple_moving_average_10 | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
              <div class="average-item">
                <span class="average-label">SMA 20:</span>
                <span class="average-value">{{ stock.simple_moving_average_20 | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
              <div class="average-item">
                <span class="average-label">SMA 50:</span>
                <span class="average-value">{{ stock.simple_moving_average_50 | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
              <div class="average-item">
                <span class="average-label">SMA 100:</span>
                <span class="average-value">{{ stock.simple_moving_average_100 | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
              <div class="average-item">
                <span class="average-label">SMA 200:</span>
                <span class="average-value">{{ stock.simple_moving_average_200 | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
            </div>
          </div>

          <!-- Additional Performance Metrics -->
          <div class="additional-performance" *ngIf="stock">
            <h2>Additional Performance</h2>
            <div class="performance-grid">
              <div class="performance-card">
                <div class="performance-label">YTD Performance</div>
                <div class="performance-value" [class.positive]="(stock.ytd_performance || 0) > 0" [class.negative]="(stock.ytd_performance || 0) <= 0">
                  {{ stock.ytd_performance | number:'1.2-2' }}%
                </div>
              </div>
              <div class="performance-card">
                <div class="performance-label">3 Month Performance</div>
                <div class="performance-value" [class.positive]="(stock.three_month_performance || 0) > 0" [class.negative]="(stock.three_month_performance || 0) <= 0">
                  {{ stock.three_month_performance | number:'1.2-2' }}%
                </div>
              </div>
              <div class="performance-card">
                <div class="performance-label">6 Month Performance</div>
                <div class="performance-value" [class.positive]="(stock.six_month_performance || 0) > 0" [class.negative]="(stock.six_month_performance || 0) <= 0">
                  {{ stock.six_month_performance | number:'1.2-2' }}%
                </div>
              </div>
              <div class="performance-card">
                <div class="performance-label">5 Year Performance</div>
                <div class="performance-value" [class.positive]="(stock.five_year_performance || 0) > 0" [class.negative]="(stock.five_year_performance || 0) <= 0">
                  {{ stock.five_year_performance | number:'1.2-2' }}%
                </div>
              </div>
              <div class="performance-card">
                <div class="performance-label">All Time Performance</div>
                <div class="performance-value" [class.positive]="(stock.all_time_performance || 0) > 0" [class.negative]="(stock.all_time_performance || 0) <= 0">
                  {{ stock.all_time_performance | number:'1.2-2' }}%
                </div>
              </div>
            </div>
          </div>

          <!-- High/Low Records -->
          <div class="high-low-records" *ngIf="stock">
            <h2>High/Low Records</h2>
            <div class="records-grid">
              <div class="record-group">
                <h3>All Time</h3>
                <div class="record-item">
                  <span class="record-label">High:</span>
                  <span class="record-value">{{ stock.all_time_high | currency:'EGP':'symbol':'1.2-2' }}</span>
                </div>
                <div class="record-item">
                  <span class="record-label">Low:</span>
                  <span class="record-value">{{ stock.all_time_low | currency:'EGP':'symbol':'1.2-2' }}</span>
                </div>
              </div>
              <div class="record-group">
                <h3>52 Week</h3>
                <div class="record-item">
                  <span class="record-label">High:</span>
                  <span class="record-value">{{ stock.fifty_two_week_high | currency:'EGP':'symbol':'1.2-2' }}</span>
                </div>
                <div class="record-item">
                  <span class="record-label">Low:</span>
                  <span class="record-value">{{ stock.fifty_two_week_low | currency:'EGP':'symbol':'1.2-2' }}</span>
                </div>
              </div>
              <div class="record-group">
                <h3>6 Month</h3>
                <div class="record-item">
                  <span class="record-label">High:</span>
                  <span class="record-value">{{ stock.six_month_high | currency:'EGP':'symbol':'1.2-2' }}</span>
                </div>
                <div class="record-item">
                  <span class="record-label">Low:</span>
                  <span class="record-value">{{ stock.six_month_low | currency:'EGP':'symbol':'1.2-2' }}</span>
                </div>
              </div>
              <div class="record-group">
                <h3>3 Month</h3>
                <div class="record-item">
                  <span class="record-label">High:</span>
                  <span class="record-value">{{ stock.three_month_high | currency:'EGP':'symbol':'1.2-2' }}</span>
                </div>
                <div class="record-item">
                  <span class="record-label">Low:</span>
                  <span class="record-value">{{ stock.three_month_low | currency:'EGP':'symbol':'1.2-2' }}</span>
                </div>
              </div>
              <div class="record-group">
                <h3>1 Month</h3>
                <div class="record-item">
                  <span class="record-label">High:</span>
                  <span class="record-value">{{ stock.one_month_high | currency:'EGP':'symbol':'1.2-2' }}</span>
                </div>
                <div class="record-item">
                  <span class="record-label">Low:</span>
                  <span class="record-value">{{ stock.one_month_low | currency:'EGP':'symbol':'1.2-2' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Volume Information -->
          <div class="volume-information" *ngIf="stock">
            <h2>Volume Information</h2>
            <div class="volume-grid">
              <div class="volume-item">
                <span class="volume-label">Volume:</span>
                <span class="volume-value">{{ formatNumber(stock.volume || 0) }}</span>
              </div>
              <div class="volume-item">
                <span class="volume-label">Volume Price:</span>
                <span class="volume-value">{{ stock.volume_price | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
              <div class="volume-item">
                <span class="volume-label">VWAP:</span>
                <span class="volume-value">{{ stock.volume_weighted_average_price | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
              <div class="volume-item">
                <span class="volume-label">Relative Volume:</span>
                <span class="volume-value">{{ stock.relative_volume | number:'1.2-2' }}</span>
              </div>
              <div class="volume-item">
                <span class="volume-label">Relative Volume at Time:</span>
                <span class="volume-value">{{ stock.relative_volume_at_time | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>

          <!-- Valuation Ratios -->
          <div class="valuation-ratios" *ngIf="stock">
            <h2>Valuation Ratios</h2>
            <div class="valuation-grid">
              <div class="valuation-item">
                <span class="valuation-label">P/E Ratio (TTM):</span>
                <span class="valuation-value">{{ stock.price_to_earnings_ratio_ttm | number:'1.2-2' }}</span>
              </div>
              <div class="valuation-item">
                <span class="valuation-label">P/B Ratio (FY):</span>
                <span class="valuation-value">{{ stock.price_to_book_fy | number:'1.2-2' }}</span>
              </div>
              <div class="valuation-item">
                <span class="valuation-label">P/B Ratio (MRQ):</span>
                <span class="valuation-value">{{ stock.price_to_book_mrq | number:'1.2-2' }}</span>
              </div>
              <div class="valuation-item">
                <span class="valuation-label">P/S Ratio (FY):</span>
                <span class="valuation-value">{{ stock.price_to_sales_fy | number:'1.2-2' }}</span>
              </div>
              <div class="valuation-item">
                <span class="valuation-label">P/Revenue Ratio (TTM):</span>
                <span class="valuation-value">{{ stock.price_to_revenue_ratio_ttm | number:'1.2-2' }}</span>
              </div>
              <div class="valuation-item">
                <span class="valuation-label">P/FCF Ratio (TTM):</span>
                <span class="valuation-value">{{ stock.price_to_free_cash_flow_ttm | number:'1.2-2' }}</span>
              </div>
              <div class="valuation-item">
                <span class="valuation-label">EV/EBITDA (TTM):</span>
                <span class="valuation-value">{{ stock.enterprise_value_ebitda_ttm | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>

          <!-- Enterprise Information -->
          <div class="enterprise-information" *ngIf="stock">
            <h2>Enterprise Information</h2>
            <div class="enterprise-grid">
              <div class="enterprise-item">
                <span class="enterprise-label">Enterprise Value:</span>
                <span class="enterprise-value">{{ formatCurrency(stock.enterprise_value || 0) }}</span>
              </div>
              <div class="enterprise-item">
                <span class="enterprise-label">Shares Outstanding:</span>
                <span class="enterprise-value">{{ formatNumber(stock.shares_outstanding || 0) }}</span>
              </div>
              <div class="enterprise-item">
                <span class="enterprise-label">Shares Float:</span>
                <span class="enterprise-value">{{ formatNumber(stock.shares_float || 0) }}</span>
              </div>
              <div class="enterprise-item">
                <span class="enterprise-label">Beta (1 Year):</span>
                <span class="enterprise-value">{{ stock.one_year_beta | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>

          <!-- Additional Technical Indicators -->
          <div class="additional-technical-indicators" *ngIf="stock">
            <h2>Additional Technical Indicators</h2>
            <div class="indicators-grid">
              <div class="indicator-group">
                <h3>Stochastic RSI</h3>
                <div class="indicator-value">{{ stock.stochastic_rsi_fast_3_3_14_14 | number:'1.1-1' }}</div>
                <div class="indicator-status" [class.overbought]="(stock.stochastic_rsi_fast_3_3_14_14 || 0) > 80" [class.oversold]="(stock.stochastic_rsi_fast_3_3_14_14 || 0) < 20">
                  {{ getStochasticStatus(stock.stochastic_rsi_fast_3_3_14_14 || 0) }}
                </div>
              </div>
              <div class="indicator-group">
                <h3>Average Directional Index</h3>
                <div class="indicator-value">{{ stock.average_directional_index_14 | number:'1.1-1' }}</div>
                <div class="indicator-status" [class.strong]="(stock.average_directional_index_14 || 0) > 25" [class.weak]="(stock.average_directional_index_14 || 0) < 20">
                  {{ (stock.average_directional_index_14 || 0) > 25 ? 'Strong Trend' : 'Weak Trend' }}
                </div>
              </div>
              <div class="indicator-group">
                <h3>Commodity Channel Index</h3>
                <div class="indicator-value">{{ stock.commodity_channel_index_20 | number:'1.1-1' }}</div>
                <div class="indicator-status" [class.overbought]="(stock.commodity_channel_index_20 || 0) > 100" [class.oversold]="(stock.commodity_channel_index_20 || 0) < -100">
                  {{ getCCIStatus(stock.commodity_channel_index_20 || 0) }}
                </div>
              </div>
              <div class="indicator-group">
                <h3>Ultimate Oscillator</h3>
                <div class="indicator-value">{{ stock.ultimate_oscillator_7_14_28 | number:'1.1-1' }}</div>
                <div class="indicator-status" [class.overbought]="(stock.ultimate_oscillator_7_14_28 || 0) > 70" [class.oversold]="(stock.ultimate_oscillator_7_14_28 || 0) < 30">
                  {{ getUltimateOscillatorStatus(stock.ultimate_oscillator_7_14_28 || 0) }}
                </div>
              </div>
              <div class="indicator-group">
                <h3>Awesome Oscillator</h3>
                <div class="indicator-value">{{ stock.awesome_oscillator | number:'1.3-3' }}</div>
                <div class="indicator-status" [class.bullish]="(stock.awesome_oscillator || 0) > 0" [class.bearish]="(stock.awesome_oscillator || 0) <= 0">
                  {{ (stock.awesome_oscillator || 0) > 0 ? 'Bullish' : 'Bearish' }}
                </div>
              </div>
              <div class="indicator-group">
                <h3>Momentum (10)</h3>
                <div class="indicator-value">{{ stock.momentum_10 | number:'1.2-2' }}</div>
                <div class="indicator-status" [class.bullish]="(stock.momentum_10 || 0) > 0" [class.bearish]="(stock.momentum_10 || 0) <= 0">
                  {{ (stock.momentum_10 || 0) > 0 ? 'Bullish' : 'Bearish' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Bollinger Bands -->
          <div class="bollinger-bands" *ngIf="stock">
            <h2>Bollinger Bands</h2>
            <div class="bollinger-grid">
              <div class="bollinger-item">
                <span class="bollinger-label">Upper Band (20):</span>
                <span class="bollinger-value">{{ stock.bollinger_upper_band_20 | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
              <div class="bollinger-item">
                <span class="bollinger-label">Lower Band (20):</span>
                <span class="bollinger-value">{{ stock.bollinger_lower_band_20 | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
              <div class="bollinger-item">
                <span class="bollinger-label">Current Price:</span>
                <span class="bollinger-value">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
            </div>
          </div>

          <!-- Ichimoku Cloud -->
          <div class="ichimoku-cloud" *ngIf="stock">
            <h2>Ichimoku Cloud</h2>
            <div class="ichimoku-grid">
              <div class="ichimoku-item">
                <span class="ichimoku-label">Conversion Line:</span>
                <span class="ichimoku-value">{{ stock.ichimoku_conversion_line_9_26_52_26 | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
              <div class="ichimoku-item">
                <span class="ichimoku-label">Base Line:</span>
                <span class="ichimoku-value">{{ stock.ichimoku_base_line_9_26_52_26 | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
              <div class="ichimoku-item">
                <span class="ichimoku-label">Leading Span A:</span>
                <span class="ichimoku-value">{{ stock.ichimoku_leading_span_a_9_26_52_26 | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
              <div class="ichimoku-item">
                <span class="ichimoku-label">Leading Span B:</span>
                <span class="ichimoku-value">{{ stock.ichimoku_leading_span_b_9_26_52_26 | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
            </div>
          </div>

          <!-- Volatility Information -->
          <div class="volatility-information" *ngIf="stock">
            <h2>Volatility Information</h2>
            <div class="volatility-grid">
              <div class="volatility-item">
                <span class="volatility-label">Volatility:</span>
                <span class="volatility-value">{{ stock.volatility | number:'1.2-2' }}%</span>
              </div>
              <div class="volatility-item">
                <span class="volatility-label">Volatility (Week):</span>
                <span class="volatility-value">{{ stock.volatility_week | number:'1.2-2' }}%</span>
              </div>
              <div class="volatility-item">
                <span class="volatility-label">Volatility (Month):</span>
                <span class="volatility-value">{{ stock.volatility_month | number:'1.2-2' }}%</span>
              </div>
              <div class="volatility-item">
                <span class="volatility-label">Average True Range (14):</span>
                <span class="volatility-value">{{ stock.average_true_range_14 | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
              <div class="volatility-item">
                <span class="volatility-label">Average Day Range (14):</span>
                <span class="volatility-value">{{ stock.average_day_range_14 | currency:'EGP':'symbol':'1.2-2' }}</span>
              </div>
            </div>
          </div>

          <!-- Ratings -->
          <div class="ratings-section" *ngIf="stock">
            <h2>Technical Ratings</h2>
            <div class="ratings-grid">
              <div class="rating-card">
                <div class="rating-label">Technical Rating</div>
                <div class="rating-value" [class.positive]="(stock.technical_rating || 0) > 0" [class.negative]="(stock.technical_rating || 0) <= 0">
                  {{ stock.technical_rating | number:'1.1-1' }}
                </div>
              </div>
              <div class="rating-card">
                <div class="rating-label">Oscillators Rating</div>
                <div class="rating-value" [class.positive]="(stock.oscillators_rating || 0) > 0" [class.negative]="(stock.oscillators_rating || 0) <= 0">
                  {{ stock.oscillators_rating | number:'1.1-1' }}
                </div>
              </div>
              <div class="rating-card">
                <div class="rating-label">Moving Averages Rating</div>
                <div class="rating-value" [class.positive]="(stock.moving_averages_rating || 0) > 0" [class.negative]="(stock.moving_averages_rating || 0) <= 0">
                  {{ stock.moving_averages_rating | number:'1.1-1' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div class="loading-state" *ngIf="loading">
            <div class="spinner"></div>
            <p>{{ languageService.getTranslation('loading') }}</p>
          </div>

          <!-- Error State -->
          <div class="error-state" *ngIf="error">
            <div class="error-icon">⚠️</div>
            <h3>{{ languageService.getTranslation('error') }}</h3>
            <p>{{ error }}</p>
            <button class="btn btn-primary" (click)="loadStock()">
              {{ languageService.getTranslation('refresh') }}
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

