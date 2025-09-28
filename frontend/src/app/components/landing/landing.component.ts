import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing-container" [class.rtl]="languageService.getCurrentLanguage()().direction === 'rtl'">

      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">{{ languageService.getTranslation('welcomeTitle') }}</h1>
            <p class="hero-subtitle">{{ languageService.getTranslation('welcomeSubtitle') }}</p>
            <div class="hero-buttons">
              <button class="btn btn-primary" (click)="goToInsights()">
                {{ languageService.getTranslation('getStarted') }}
              </button>
              <button class="btn btn-secondary" (click)="goToStocks()">
                {{ languageService.getTranslation('exploreStocks') }}
              </button>
            </div>
          </div>
          <div class="hero-visual">
            <div class="chart-placeholder">
              <div class="chart-bars">
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 45%"></div>
                <div class="bar" style="height: 90%"></div>
                <div class="bar" style="height: 70%"></div>
                <div class="bar" style="height: 85%"></div>
                <div class="bar" style="height: 55%"></div>
                <div class="bar" style="height: 95%"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="container">
          <h2 class="section-title">Key Features</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3>Real-time Data</h3>
              <p>Get up-to-date stock prices and market data from the Egyptian stock exchange</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎯</div>
              <h3>Smart Insights</h3>
              <p>AI-powered analysis to identify bullish, bearish, and value opportunities</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📈</div>
              <h3>Technical Analysis</h3>
              <p>Comprehensive technical indicators and charting tools for informed decisions</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💰</div>
              <h3>Investment Strategies</h3>
              <p>Find the best stocks for short, medium, and long-term investment horizons</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Market Overview -->
      <section class="market-overview">
        <div class="container">
          <h2 class="section-title">Market Overview</h2>
          <div class="overview-stats">
            <div class="stat-card">
              <div class="stat-value">500+</div>
              <div class="stat-label">Stocks Tracked</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">24/7</div>
              <div class="stat-label">Real-time Updates</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">50+</div>
              <div class="stat-label">Technical Indicators</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">100%</div>
              <div class="stat-label">Free Access</div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <div class="container">
          <div class="cta-content">
            <h2>Ready to Start Investing?</h2>
            <p>Join thousands of investors who trust our insights for their Egyptian stock market decisions</p>
            <button class="btn btn-primary btn-large" (click)="goToInsights()">
              Start Analyzing Now
            </button>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <h3>StockInsights</h3>
              <p>Your trusted partner for Egyptian stock market analysis</p>
            </div>
            <div class="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a routerLink="/insights">Market Insights</a></li>
                <li><a routerLink="/stocks">Stock List</a></li>
                <li><a href="#">About Us</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>Contact</h4>
              <p>Email: info@stockinsights.com</p>
              <p>Phone: +20 123 456 7890</p>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2024 StockInsights. All rights reserved.</p>
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

