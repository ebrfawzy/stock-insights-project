import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StockService, Stock } from '../../services/stock.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="stocks-container" [class.rtl]="languageService.getCurrentLanguage()().direction === 'rtl'">

      <!-- Main Content -->
      <main class="main-content">
        <div class="container">
          <!-- Page Header -->
          <div class="page-header">
            <h1>Stock List</h1>
            <p>Browse and analyze all Egyptian stocks</p>
          </div>

          <!-- Filters -->
          <div class="filters-section">
            <div class="filters-grid">
              <div class="filter-group">
                <label>{{ languageService.getTranslation('search') }}:</label>
                <input 
                  type="text" 
                  [(ngModel)]="searchTerm" 
                  (input)="onSearchChange()"
                  placeholder="Search by symbol or name..."
                  class="search-input">
              </div>
              <div class="filter-group">
                <label>Sector:</label>
                <select [(ngModel)]="selectedSector" (change)="onFilterChange()" class="filter-select">
                  <option value="">All Sectors</option>
                  <option *ngFor="let sector of sectors" [value]="sector">{{ sector }}</option>
                </select>
              </div>
              <div class="filter-group">
                <label>Industry:</label>
                <select [(ngModel)]="selectedIndustry" (change)="onFilterChange()" class="filter-select">
                  <option value="">All Industries</option>
                  <option *ngFor="let industry of industries" [value]="industry">{{ industry }}</option>
                </select>
              </div>
              <div class="filter-group">
                <label>Sort by:</label>
                <select [(ngModel)]="sortBy" (change)="onSortChange()" class="filter-select">
                  <option value="market_capitalization">Market Cap</option>
                  <option value="price">Price</option>
                  <option value="change_percent">Change %</option>
                  <option value="volume">Volume</option>
                  <option value="symbol">Symbol</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Stocks Table -->
          <div class="stocks-table-container">
            <div class="table-header">
              <h2>Stocks ({{ filteredStocks.length }})</h2>
              <button class="btn btn-primary" (click)="refreshData()" [disabled]="loading">
                {{ loading ? languageService.getTranslation('loading') : languageService.getTranslation('refresh') }}
              </button>
            </div>

            <div class="table-wrapper">
              <table class="stocks-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Symbol</th>
                    <th>Name</th>
                    <th>{{ languageService.getTranslation('price') }}</th>
                    <th>{{ languageService.getTranslation('change') }}</th>
                    <th>{{ languageService.getTranslation('volume') }}</th>
                    <th>{{ languageService.getTranslation('marketCap') }}</th>
                    <th>{{ languageService.getTranslation('peRatio') }}</th>
                    <th>Sector</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let stock of paginatedStocks; let i = index" class="stock-row">
                    <td class="rank">{{ (currentPage - 1) * pageSize + i + 1 }}</td>
                    <td class="symbol">{{ stock.symbol }}</td>
                    <td class="name">{{ stock.name }}</td>
                    <td class="price">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</td>
                    <td class="change" [class.positive]="stock.change_percent > 0" [class.negative]="stock.change_percent <= 0">
                      {{ stock.change_percent | number:'1.2-2' }}%
                    </td>
                    <td class="volume">{{ formatNumber(stock.volume) }}</td>
                    <td class="market-cap">{{ formatCurrency(stock.market_capitalization) }}</td>
                    <td class="pe-ratio">{{ stock.price_to_earnings_ratio_ttm | number:'1.1-1' }}</td>
                    <td class="sector">{{ stock.sector }}</td>
                    <td class="actions">
                      <button class="btn btn-sm btn-primary" [routerLink]="['/stocks', stock.symbol]">
                        {{ languageService.getTranslation('viewDetails') }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="pagination" *ngIf="totalPages > 1">
              <button 
                class="btn btn-sm" 
                [disabled]="currentPage === 1" 
                (click)="goToPage(currentPage - 1)">
                Previous
              </button>
              
              <div class="page-numbers">
                <button 
                  *ngFor="let page of getPageNumbers()" 
                  class="btn btn-sm"
                  [class.active]="page === currentPage"
                  (click)="goToPage(page)">
                  {{ page }}
                </button>
              </div>
              
              <button 
                class="btn btn-sm" 
                [disabled]="currentPage === totalPages" 
                (click)="goToPage(currentPage + 1)">
                Next
              </button>
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

          <!-- No Data State -->
          <div class="no-data-state" *ngIf="!loading && !error && filteredStocks.length === 0">
            <div class="no-data-icon">📊</div>
            <h3>{{ languageService.getTranslation('noData') }}</h3>
            <p>No stocks found matching your criteria</p>
            <button class="btn btn-primary" (click)="clearFilters()">
              Clear Filters
            </button>
          </div>
        </div>
      </main>
    </div>
  `
})
export class StocksComponent implements OnInit {
  stocks: Stock[] = [];
  filteredStocks: Stock[] = [];
  paginatedStocks: Stock[] = [];
  loading = false;
  error: string | null = null;

  // Filter and search
  searchTerm = '';
  selectedSector = '';
  selectedIndustry = '';
  sortBy = 'market_capitalization';

  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalPages = 0;

  // Filter options
  sectors: string[] = [];
  industries: string[] = [];

  constructor(
    private stockService: StockService,
    public languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    this.loading = true;
    this.error = null;

    this.stockService.getStocks().subscribe({
      next: (response) => {
        console.log('Stocks API Response:', response); // Debug log
        
        // Handle new response structure: {success: true, data: [...], count: N, cached?: boolean}
        if (response && response.success && Array.isArray(response.data)) {
          this.stocks = response.data;
          console.log('Processed stocks:', this.stocks.length, 'cached:', response.cached); // Debug log
        } else {
          console.error('Unexpected response structure:', response);
          this.stocks = [];
        }
        
        this.extractFilterOptions();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Stocks API Error:', err); // Debug log
        this.error = 'Error loading stocks: ' + err.message;
        this.loading = false;
      }
    });
  }

  extractFilterOptions(): void {
    console.log('Extracting filter options from', this.stocks.length, 'stocks');
    
    if (!Array.isArray(this.stocks)) {
      console.log('No stocks array available for filter options');
      return;
    }
    
    const sectorsSet = new Set<string>();
    const industriesSet = new Set<string>();

    this.stocks.forEach(stock => {
      if (stock.sector) sectorsSet.add(stock.sector);
      if (stock.industry) industriesSet.add(stock.industry);
    });

    this.sectors = Array.from(sectorsSet).sort();
    this.industries = Array.from(industriesSet).sort();
    
    console.log('Extracted sectors:', this.sectors);
    console.log('Extracted industries:', this.industries);
  }

  applyFilters(): void {
    console.log('Applying filters...', {
      stocksCount: this.stocks.length,
      searchTerm: this.searchTerm,
      selectedSector: this.selectedSector,
      selectedIndustry: this.selectedIndustry,
      sortBy: this.sortBy
    });

    if (!Array.isArray(this.stocks)) {
      console.log('No stocks array available');
      this.filteredStocks = [];
      return;
    }
    
    let filtered = [...this.stocks];
    console.log('Starting with', filtered.length, 'stocks');

    // Search filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(stock => 
        stock.symbol.toLowerCase().includes(searchLower) ||
        stock.name.toLowerCase().includes(searchLower)
      );
      console.log('After search filter:', filtered.length, 'stocks');
    }

    // Sector filter
    if (this.selectedSector) {
      filtered = filtered.filter(stock => stock.sector === this.selectedSector);
      console.log('After sector filter:', filtered.length, 'stocks');
    }

    // Industry filter
    if (this.selectedIndustry) {
      filtered = filtered.filter(stock => stock.industry === this.selectedIndustry);
      console.log('After industry filter:', filtered.length, 'stocks');
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[this.sortBy as keyof Stock];
      const bValue = b[this.sortBy as keyof Stock];
      
      if (this.sortBy === 'symbol') {
        return (aValue as string).localeCompare(bValue as string);
      }
      
      return (bValue as number) - (aValue as number);
    });

    console.log('Final filtered stocks:', filtered.length);
    this.filteredStocks = filtered;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredStocks.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedStocks = this.filteredStocks.slice(startIndex, endIndex);
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  refreshData(): void {
    this.loadStocks();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedSector = '';
    this.selectedIndustry = '';
    this.sortBy = 'market_capitalization';
    this.currentPage = 1;
    this.applyFilters();
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
}
