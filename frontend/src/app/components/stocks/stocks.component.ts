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
    <div class="bg-secondary-custom min-vh-100" [class.rtl]="languageService.getCurrentLanguage()().direction === 'rtl'">

      <!-- Main Content -->
      <main class="py-4">
        <div class="container-fluid">
          <!-- Page Header -->
          <div class="row mb-4">
            <div class="col">
              <h1 class="display-5 text-primary-custom mb-2">Stock List</h1>
              <p class="lead text-muted-custom">Browse and analyze all Egyptian stocks</p>
            </div>
          </div>

          <!-- Filters -->
          <div class="card shadow-custom mb-4">
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-3">
                  <label class="form-label text-primary-custom fw-semibold">{{ languageService.getTranslation('search') }}:</label>
                  <input 
                    type="text" 
                    [(ngModel)]="searchTerm" 
                    (input)="onSearchChange()"
                    placeholder="Search by symbol or name..."
                    class="form-control">
                </div>
                <div class="col-md-3">
                  <label class="form-label text-primary-custom fw-semibold">Sector:</label>
                  <select [(ngModel)]="selectedSector" (change)="onFilterChange()" class="form-select">
                    <option value="">All Sectors</option>
                    <option *ngFor="let sector of sectors" [value]="sector">{{ sector }}</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label text-primary-custom fw-semibold">Industry:</label>
                  <select [(ngModel)]="selectedIndustry" (change)="onFilterChange()" class="form-select">
                    <option value="">All Industries</option>
                    <option *ngFor="let industry of industries" [value]="industry">{{ industry }}</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label text-primary-custom fw-semibold">Sort by:</label>
                  <select [(ngModel)]="sortBy" (change)="onSortChange()" class="form-select">
                    <option value="market_capitalization">Market Cap</option>
                    <option value="price">Price</option>
                    <option value="change_percent">Change %</option>
                    <option value="volume">Volume</option>
                    <option value="symbol">Symbol</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Stocks Table -->
          <div class="card shadow-custom">
            <div class="card-header d-flex justify-content-between align-items-center bg-primary-custom">
              <h4 class="mb-0 text-primary-custom">Stocks ({{ filteredStocks.length }})</h4>
              <button class="btn btn-primary" (click)="refreshData()" [disabled]="loading">
                <i class="bi bi-arrow-clockwise me-1"></i>
                {{ loading ? languageService.getTranslation('loading') : languageService.getTranslation('refresh') }}
              </button>
            </div>

            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="text-primary-custom">#</th>
                    <th class="text-primary-custom">Symbol</th>
                    <th class="text-primary-custom">Name</th>
                    <th class="text-primary-custom">{{ languageService.getTranslation('price') }}</th>
                    <th class="text-primary-custom">{{ languageService.getTranslation('change') }}</th>
                    <th class="text-primary-custom">{{ languageService.getTranslation('volume') }}</th>
                    <th class="text-primary-custom">{{ languageService.getTranslation('marketCap') }}</th>
                    <th class="text-primary-custom">{{ languageService.getTranslation('peRatio') }}</th>
                    <th class="text-primary-custom">Sector</th>
                    <th class="text-primary-custom">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let stock of paginatedStocks; let i = index">
                    <td class="text-muted-custom">{{ (currentPage - 1) * pageSize + i + 1 }}</td>
                    <td class="fw-bold text-primary-custom">{{ stock.symbol }}</td>
                    <td class="text-secondary-custom">{{ stock.name }}</td>
                    <td class="fw-semibold">{{ stock.price | currency:'EGP':'symbol':'1.2-2' }}</td>
                    <td [class.text-success]="stock.change_percent > 0" [class.text-danger]="stock.change_percent <= 0" class="fw-semibold">
                      <i class="bi" [class.bi-arrow-up]="stock.change_percent > 0" [class.bi-arrow-down]="stock.change_percent <= 0"></i>
                      {{ stock.change_percent | number:'1.2-2' }}%
                    </td>
                    <td class="text-muted-custom">{{ formatNumber(stock.volume) }}</td>
                    <td class="text-muted-custom">{{ formatCurrency(stock.market_capitalization) }}</td>
                    <td class="text-muted-custom">{{ stock.price_to_earnings_ratio_ttm | number:'1.1-1' }}</td>
                    <td><span class="badge bg-secondary">{{ stock.sector }}</span></td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary" [routerLink]="['/stocks', stock.symbol]">
                        <i class="bi bi-eye me-1"></i>{{ languageService.getTranslation('viewDetails') }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="card-footer" *ngIf="totalPages > 1">
              <nav aria-label="Stock pagination">
                <ul class="pagination justify-content-center mb-0">
                  <li class="page-item" [class.disabled]="currentPage === 1">
                    <button class="page-link" (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1">
                      <i class="bi bi-chevron-left"></i> Previous
                    </button>
                  </li>
                  
                  <li class="page-item" *ngFor="let page of getPageNumbers()" [class.active]="page === currentPage">
                    <button class="page-link" (click)="goToPage(page)">
                      {{ page }}
                    </button>
                  </li>
                  
                  <li class="page-item" [class.disabled]="currentPage === totalPages">
                    <button class="page-link" (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages">
                      Next <i class="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <!-- Loading State -->
          <div class="text-center py-5" *ngIf="loading">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted-custom">{{ languageService.getTranslation('loading') }}</p>
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

          <!-- No Data State -->
          <div class="text-center py-5" *ngIf="!loading && !error && filteredStocks.length === 0">
            <i class="bi bi-graph-up fs-1 text-muted mb-3"></i>
            <h4 class="text-primary-custom">{{ languageService.getTranslation('noData') }}</h4>
            <p class="text-muted-custom mb-3">No stocks found matching your criteria</p>
            <button class="btn btn-outline-primary" (click)="clearFilters()">
              <i class="bi bi-funnel me-1"></i>Clear Filters
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
