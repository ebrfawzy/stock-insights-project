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
    <div class="insights-container" [class.rtl]="languageService.getCurrentLanguage()().direction === 'rtl'">

      <!-- Main Content -->
      <main class="main-content">
        <div class="container">
          <!-- Page Header -->
          <div class="page-header">
            <h1>{{ languageService.getTranslation('marketInsights') }}</h1>
            <p>Comprehensive analysis of the Egyptian stock market</p>
            <button class="btn btn-primary" (click)="refreshData()" [disabled]="loading">
              {{ loading ? languageService.getTranslation('loading') : languageService.getTranslation('refresh') }}
            </button>
          </div>

          <!-- Market Overview -->
          <div class="market-overview" *ngIf="insights">
            <h2>Market Overview</h2>
            <div class="overview-cards">
              <div class="overview-card">
                <div class="card-value">{{ insights.total_stocks }}</div>
                <div class="card-label">Total Stocks</div>
              </div>
              <div class="overview-card">
                <div class="card-value">{{ formatCurrency(insights.market_overview.total_market_cap) }}</div>
                <div class="card-label">Total Market Cap</div>
              </div>
              <div class="overview-card">
                <div class="card-value">{{ insights.market_overview.average_pe_ratio | number:'1.1-1' }}</div>
                <div class="card-label">Average P/E Ratio</div>
              </div>
              <div class="overview-card">
                <div class="card-value">{{ formatNumber(insights.market_overview.average_volume) }}</div>
                <div class="card-label">Average Volume</div>
              </div>
            </div>
          </div>

          <!-- Insights Grid -->
          <div class="insights-grid" *ngIf="insights && !loading">
            <!-- Top Bullish Stocks -->
            <div class="insight-section">
              <h3 class="section-title bullish">
                <span class="icon">📈</span>
                {{ languageService.getTranslation('topBullish') }}
              </h3>
              <div class="stock-list">
                <div class="stock-item" *ngFor="let stock of insights.top_bullish; let i = index"
                     [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                     [class.disabled]="!stock.symbol || stock.symbol === 'N/A'">
                  <div class="stock-rank">{{ i + 1 }}</div>
                  <div class="stock-info">
                    <div class="stock-symbol">{{ stock.symbol || 'N/A' }}</div>
                    <div class="stock-name">{{ stock.name || 'Unknown' }}</div>
                  </div>
                  <div class="stock-price">
                    <div class="price">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                    <div class="change positive" *ngIf="stock.change_percent > 0">
                      +{{ stock.change_percent | number:'1.2-2' }}%
                    </div>
                    <div class="change negative" *ngIf="stock.change_percent <= 0">
                      {{ stock.change_percent | number:'1.2-2' }}%
                    </div>
                    <div class="technical-rating">Technical Rating: {{ stock.technical_rating | number:'1.2-2' }}</div>
                  </div>
                </div>
                <div class="empty-state" *ngIf="!insights.top_bullish || insights.top_bullish.length === 0">
                  <p>No bullish stocks available at the moment.</p>
                </div>
              </div>
            </div>

            <!-- Top Bearish Stocks -->
            <div class="insight-section">
              <h3 class="section-title bearish">
                <span class="icon">📉</span>
                {{ languageService.getTranslation('topBearish') }}
              </h3>
              <div class="stock-list">
                <div class="stock-item" *ngFor="let stock of insights.top_bearish; let i = index"
                     [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                     [class.disabled]="!stock.symbol || stock.symbol === 'N/A'">
                  <div class="stock-rank">{{ i + 1 }}</div>
                  <div class="stock-info">
                    <div class="stock-symbol">{{ stock.symbol || 'N/A' }}</div>
                    <div class="stock-name">{{ stock.name || 'Unknown' }}</div>
                  </div>
                  <div class="stock-price">
                    <div class="price">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                    <div class="change positive" *ngIf="stock.change_percent > 0">
                      +{{ stock.change_percent | number:'1.2-2' }}%
                    </div>
                    <div class="change negative" *ngIf="stock.change_percent <= 0">
                      {{ stock.change_percent | number:'1.2-2' }}%
                    </div>
                    <div class="technical-rating">Technical Rating: {{ stock.technical_rating | number:'1.2-2' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Break -->
            <div class="section-break"></div>

            <!-- Overpriced Stocks -->
            <div class="insight-section two-sections">
              <h3 class="section-title overpriced">
                <span class="icon">💰</span>
                {{ languageService.getTranslation('overpriced') }}
              </h3>
              <div class="stock-list">
                <div class="stock-item" *ngFor="let stock of insights.overpriced; let i = index"
                     [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                     [class.disabled]="!stock.symbol || stock.symbol === 'N/A'">
                  <div class="stock-rank">{{ i + 1 }}</div>
                  <div class="stock-info">
                    <div class="stock-symbol">{{ stock.symbol || 'N/A' }}</div>
                    <div class="stock-name">{{ stock.name || 'Unknown' }}</div>
                  </div>
                  <div class="stock-price">
                    <div class="price">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                    <div class="pe-ratio">P/E (TTM): {{ stock.price_to_earnings_ratio_ttm | number:'1.1-1' }}</div>
                    <div class="pb-ratio">P/B (MRQ): {{ stock.price_to_book_mrq | number:'1.1-1' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Underpriced Stocks -->
            <div class="insight-section two-sections">
              <h3 class="section-title underpriced">
                <span class="icon">💎</span>
                {{ languageService.getTranslation('underpriced') }}
              </h3>
              <div class="stock-list">
                <div class="stock-item" *ngFor="let stock of insights.underpriced; let i = index"
                     [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                     [class.disabled]="!stock.symbol || stock.symbol === 'N/A'">
                  <div class="stock-rank">{{ i + 1 }}</div>
                  <div class="stock-info">
                    <div class="stock-symbol">{{ stock.symbol || 'N/A' }}</div>
                    <div class="stock-name">{{ stock.name || 'Unknown' }}</div>
                  </div>
                  <div class="stock-price">
                    <div class="price">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                    <div class="pe-ratio">P/E (TTM): {{ stock.price_to_earnings_ratio_ttm | number:'1.1-1' }}</div>
                    <div class="pb-ratio">P/B (MRQ): {{ stock.price_to_book_mrq | number:'1.1-1' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Break -->
            <div class="section-break"></div>

            <!-- Volume Leaders -->
            <div class="insight-section">
              <h3 class="section-title volume">
                <span class="icon">📊</span>
                {{ languageService.getTranslation('volumeLeaders') }}
              </h3>
              <div class="stock-list">
                <div class="stock-item" *ngFor="let stock of insights.volume_leaders; let i = index"
                     [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                     [class.disabled]="!stock.symbol || stock.symbol === 'N/A'">
                  <div class="stock-rank">{{ i + 1 }}</div>
                  <div class="stock-info">
                    <div class="stock-symbol">{{ stock.symbol || 'N/A' }}</div>
                    <div class="stock-name">{{ stock.name || 'Unknown' }}</div>
                  </div>
                  <div class="stock-price">
                    <div class="price">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                    <div class="volume">Volume: {{ formatNumber(stock.volume) }}</div>
                    <div class="relative-volume">Relative Volume: {{ stock.relative_volume | number:'1.1-1' }}x</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Top Sectors Change -->
            <div class="insight-section sectors">
              <h3 class="section-title sectors">
                <span class="icon">🏢</span>
                Top Sectors Change
              </h3>
              <div class="sector-list">
                <div class="sector-item" *ngFor="let sector of insights.top_sectors_change; let i = index">
                  <div class="sector-rank">{{ i + 1 }}</div>
                  <div class="sector-name">{{ sector.sector || 'Unknown' }}</div>
                  <div class="sector-change" [class.positive]="sector.change > 0" [class.negative]="sector.change <= 0">
                    {{ sector.change | number:'1.2-2' }}%
                  </div>
                </div>
                <div class="empty-state" *ngIf="!insights.top_sectors_change || insights.top_sectors_change.length === 0">
                  <p>No sector data available at the moment.</p>
                </div>
              </div>
            </div>

            <!-- Break -->
            <div class="section-break"></div>

            <!-- Top +ve Movers -->
            <div class="insight-section two-sections">
              <h3 class="section-title positive-movers">
                <span class="icon">📈</span>
                Top +ve Movers
              </h3>
              <div class="stock-list">
                <div class="stock-item" *ngFor="let stock of insights.top_positive_movers; let i = index"
                     [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                     [class.disabled]="!stock.symbol || stock.symbol === 'N/A'">
                  <div class="stock-rank">{{ i + 1 }}</div>
                  <div class="stock-info">
                    <div class="stock-symbol">{{ stock.symbol || 'N/A' }}</div>
                    <div class="stock-name">{{ stock.name || 'Unknown' }}</div>
                  </div>
                  <div class="stock-price">
                    <div class="price">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                    <div class="change positive" *ngIf="stock.change_percent > 0">
                      +{{ stock.change_percent | number:'1.2-2' }}%
                    </div>
                    <div class="change negative" *ngIf="stock.change_percent <= 0">
                      {{ stock.change_percent | number:'1.2-2' }}%
                    </div>
                  </div>
                </div>
                <div class="empty-state" *ngIf="!insights.top_positive_movers || insights.top_positive_movers.length === 0">
                  <p>No positive movers available at the moment.</p>
                </div>
              </div>
            </div>

            <!-- Top -ve Movers -->
            <div class="insight-section two-sections">
              <h3 class="section-title negative-movers">
                <span class="icon">📉</span>
                Top -ve Movers
              </h3>
              <div class="stock-list">
                <div class="stock-item" *ngFor="let stock of insights.top_negative_movers; let i = index"
                     [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                     [class.disabled]="!stock.symbol || stock.symbol === 'N/A'">
                  <div class="stock-rank">{{ i + 1 }}</div>
                  <div class="stock-info">
                    <div class="stock-symbol">{{ stock.symbol || 'N/A' }}</div>
                    <div class="stock-name">{{ stock.name || 'Unknown' }}</div>
                  </div>
                  <div class="stock-price">
                    <div class="price">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                    <div class="change positive" *ngIf="stock.change_percent > 0">
                      +{{ stock.change_percent | number:'1.2-2' }}%
                    </div>
                    <div class="change negative" *ngIf="stock.change_percent <= 0">
                      {{ stock.change_percent | number:'1.2-2' }}%
                    </div>
                  </div>
                </div>
                <div class="empty-state" *ngIf="!insights.top_negative_movers || insights.top_negative_movers.length === 0">
                  <p>No negative movers available at the moment.</p>
                </div>
              </div>
            </div>

            <!-- Break -->
            <div class="section-break"></div>

            <!-- Dividend Stocks -->
            <div class="insight-section">
              <h3 class="section-title dividend">
                <span class="icon">💵</span>
                {{ languageService.getTranslation('dividendStocks') }}
              </h3>
              <div class="stock-list">
                <div class="stock-item" *ngFor="let stock of insights.dividend_stocks; let i = index"
                     [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                     [class.disabled]="!stock.symbol || stock.symbol === 'N/A'">
                  <div class="stock-rank">{{ i + 1 }}</div>
                  <div class="stock-info">
                    <div class="stock-symbol">{{ stock.symbol || 'N/A' }}</div>
                    <div class="stock-name">{{ stock.name || 'Unknown' }}</div>
                  </div>
                  <div class="stock-price">
                    <div class="price">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                    <div class="dividend">Dividend Yield Forward: {{ stock.dividend_yield_forward | number:'1.2-2' }}%</div>
                    <div class="dividends-per-share">Dividends per Share (FY): {{ stock.dividends_per_share_fy | currency:'EGP':'symbol':'1.2-2' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Momentum Stocks -->
            <div class="insight-section">
              <h3 class="section-title momentum">
                <span class="icon">⚡</span>
                {{ languageService.getTranslation('momentumStocks') }}
              </h3>
              <div class="stock-list">
                <div class="stock-item" *ngFor="let stock of insights.momentum_stocks; let i = index"
                     [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                     [class.disabled]="!stock.symbol || stock.symbol === 'N/A'">
                  <div class="stock-rank">{{ i + 1 }}</div>
                  <div class="stock-info">
                    <div class="stock-symbol">{{ stock.symbol || 'N/A' }}</div>
                    <div class="stock-name">{{ stock.name || 'Unknown' }}</div>
                  </div>
                  <div class="stock-price">
                    <div class="price">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                    <div class="momentum">Momentum (10): {{ stock.momentum_10 | number:'1.2-2' }}</div>
                    <div class="change" [class.positive]="stock.change_percent > 0" [class.negative]="stock.change_percent <= 0">
                      Change: {{ stock.change_percent | number:'1.2-2' }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Growth Stocks -->
            <div class="insight-section">
              <h3 class="section-title growth">
                <span class="icon">🚀</span>
                {{ languageService.getTranslation('growthStocks') }}
              </h3>
              <div class="stock-list">
                <div class="stock-item" *ngFor="let stock of insights.growth_stocks; let i = index"
                     [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                     [class.disabled]="!stock.symbol || stock.symbol === 'N/A'">
                  <div class="stock-rank">{{ i + 1 }}</div>
                  <div class="stock-info">
                    <div class="stock-symbol">{{ stock.symbol || 'N/A' }}</div>
                    <div class="stock-name">{{ stock.name || 'Unknown' }}</div>
                  </div>
                  <div class="stock-price">
                    <div class="price">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                    <div class="growth">Revenue (TTM YoY Growth): {{ stock.revenue_ttm_yoy_growth | number:'1.2-2' }}%</div>
                    <div class="eps-growth">EPS Diluted (TTM YoY Growth): {{ stock.eps_diluted_ttm_yoy_growth | number:'1.2-2' }}%</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Break -->
            <div class="section-break"></div>

            <!-- Best Short Term -->
            <div class="insight-section">
              <h3 class="section-title short-term">
                <span class="icon">⚡</span>
                {{ languageService.getTranslation('bestShortTerm') }}
              </h3>
              <div class="stock-list">
                <div class="stock-item" *ngFor="let stock of insights.best_short_term; let i = index"
                     [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                     [class.disabled]="!stock.symbol || stock.symbol === 'N/A'">
                  <div class="stock-rank">{{ i + 1 }}</div>
                  <div class="stock-info">
                    <div class="stock-symbol">{{ stock.symbol || 'N/A' }}</div>
                    <div class="stock-name">{{ stock.name || 'Unknown' }}</div>
                  </div>
                  <div class="stock-price">
                    <div class="price">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                    <div class="performance">Weekly Performance: {{ stock.weekly_performance | number:'1.2-2' }}%</div>
                    <div class="rsi">RSI (7): {{ stock.relative_strength_index_7 | number:'1.1-1' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Best Medium Term -->
            <div class="insight-section">
              <h3 class="section-title medium-term">
                <span class="icon">📅</span>
                {{ languageService.getTranslation('bestMediumTerm') }}
              </h3>
              <div class="stock-list">
                <div class="stock-item" *ngFor="let stock of insights.best_medium_term; let i = index"
                     [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                     [class.disabled]="!stock.symbol || stock.symbol === 'N/A'">
                  <div class="stock-rank">{{ i + 1 }}</div>
                  <div class="stock-info">
                    <div class="stock-symbol">{{ stock.symbol || 'N/A' }}</div>
                    <div class="stock-name">{{ stock.name || 'Unknown' }}</div>
                  </div>
                  <div class="stock-price">
                    <div class="price">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                    <div class="performance">Monthly Performance: {{ stock.monthly_performance | number:'1.2-2' }}%</div>
                    <div class="change-1m" *ngIf="stock.change_1m_percent">Change 1M: {{ stock.change_1m_percent | number:'1.2-2' }}%</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Best Long Term -->
            <div class="insight-section">
              <h3 class="section-title long-term">
                <span class="icon">🎯</span>
                {{ languageService.getTranslation('bestLongTerm') }}
              </h3>
              <div class="stock-list">
                <div class="stock-item" *ngFor="let stock of insights.best_long_term; let i = index"
                     [routerLink]="stock.symbol && stock.symbol !== 'N/A' ? ['/stocks', stock.symbol] : null"
                     [class.disabled]="!stock.symbol || stock.symbol === 'N/A'">
                  <div class="stock-rank">{{ i + 1 }}</div>
                  <div class="stock-info">
                    <div class="stock-symbol">{{ stock.symbol || 'N/A' }}</div>
                    <div class="stock-name">{{ stock.name || 'Unknown' }}</div>
                  </div>
                  <div class="stock-price">
                    <div class="price">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</div>
                    <div class="performance">Yearly Performance: {{ stock.yearly_performance | number:'1.2-2' }}%</div>
                    <div class="roe">ROE (TTM): {{ stock.return_on_equity_ttm | number:'1.1-1' }}%</div>
                  </div>
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
            <button class="btn btn-primary" (click)="refreshData()">
              {{ languageService.getTranslation('refresh') }}
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
