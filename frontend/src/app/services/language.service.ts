import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Language {
  code: string;
  name: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export interface Translations {
  // Navigation
  home: string;
  insights: string;
  stocks: string;
  about: string;
  
  // Landing page
  welcomeTitle: string;
  welcomeSubtitle: string;
  getStarted: string;
  exploreStocks: string;
  
  // Insights page
  marketInsights: string;
  topBullish: string;
  topBearish: string;
  bestShortTerm: string;
  bestMediumTerm: string;
  bestLongTerm: string;
  overpriced: string;
  underpriced: string;
  volumeLeaders: string;
  momentumStocks: string;
  dividendStocks: string;
  growthStocks: string;
  
  // Stock details
  stockDetails: string;
  price: string;
  change: string;
  volume: string;
  marketCap: string;
  peRatio: string;
  dividendYield: string;
  technicalRating: string;
  
  // Performance
  weeklyPerformance: string;
  monthlyPerformance: string;
  yearlyPerformance: string;
  
  // Technical indicators
  technicalIndicators: string;
  rsi: string;
  macd: string;
  movingAverages: string;
  bollingerBands: string;
  
  // Financial metrics
  financialMetrics: string;
  revenue: string;
  profit: string;
  debt: string;
  equity: string;
  
  // Common
  loading: string;
  error: string;
  noData: string;
  refresh: string;
  search: string;
  filter: string;
  sort: string;
  viewDetails: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translations: Record<string, Translations> = {
    'en': {
      // Navigation
      home: 'Home',
      insights: 'Insights',
      stocks: 'Stocks',
      about: 'About',
      
      // Landing page
      welcomeTitle: 'Egyptian Stock Market Insights',
      welcomeSubtitle: 'Discover comprehensive analysis and insights for Egyptian stocks',
      getStarted: 'Get Started',
      exploreStocks: 'Explore Stocks',
      
      // Insights page
      marketInsights: 'Market Insights',
      topBullish: 'Top Bullish Stocks',
      topBearish: 'Top Bearish Stocks',
      bestShortTerm: 'Best Short Term (1 Week)',
      bestMediumTerm: 'Best Medium Term (1 Month)',
      bestLongTerm: 'Best Long Term (1 Year)',
      overpriced: 'Overpriced Stocks',
      underpriced: 'Underpriced Stocks',
      volumeLeaders: 'Volume Leaders',
      momentumStocks: 'Momentum Stocks',
      dividendStocks: 'Dividend Stocks',
      growthStocks: 'Growth Stocks',
      
      // Stock details
      stockDetails: 'Stock Details',
      price: 'Price',
      change: 'Change',
      volume: 'Volume',
      marketCap: 'Market Cap',
      peRatio: 'P/E Ratio',
      dividendYield: 'Dividend Yield',
      technicalRating: 'Technical Rating',
      
      // Performance
      weeklyPerformance: 'Weekly Performance',
      monthlyPerformance: 'Monthly Performance',
      yearlyPerformance: 'Yearly Performance',
      
      // Technical indicators
      technicalIndicators: 'Technical Indicators',
      rsi: 'RSI',
      macd: 'MACD',
      movingAverages: 'Moving Averages',
      bollingerBands: 'Bollinger Bands',
      
      // Financial metrics
      financialMetrics: 'Financial Metrics',
      revenue: 'Revenue',
      profit: 'Profit',
      debt: 'Debt',
      equity: 'Equity',
      
      // Common
      loading: 'Loading...',
      error: 'Error',
      noData: 'No data available',
      refresh: 'Refresh',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      viewDetails: 'View Details'
    },
    'ar': {
      // Navigation
      home: 'الرئيسية',
      insights: 'الرؤى',
      stocks: 'الأسهم',
      about: 'حول',
      
      // Landing page
      welcomeTitle: 'رؤى سوق الأسهم المصرية',
      welcomeSubtitle: 'اكتشف التحليل الشامل والرؤى لأسهم السوق المصرية',
      getStarted: 'ابدأ الآن',
      exploreStocks: 'استكشف الأسهم',
      
      // Insights page
      marketInsights: 'رؤى السوق',
      topBullish: 'أفضل الأسهم الصاعدة',
      topBearish: 'أفضل الأسهم الهابطة',
      bestShortTerm: 'أفضل للاستثمار قصير المدى (أسبوع)',
      bestMediumTerm: 'أفضل للاستثمار متوسط المدى (شهر)',
      bestLongTerm: 'أفضل للاستثمار طويل المدى (سنة)',
      overpriced: 'الأسهم المبالغ في قيمتها',
      underpriced: 'الأسهم المقومة بأقل من قيمتها',
      volumeLeaders: 'قادة الحجم',
      momentumStocks: 'أسهم الزخم',
      dividendStocks: 'أسهم الأرباح',
      growthStocks: 'أسهم النمو',
      
      // Stock details
      stockDetails: 'تفاصيل السهم',
      price: 'السعر',
      change: 'التغيير',
      volume: 'الحجم',
      marketCap: 'القيمة السوقية',
      peRatio: 'نسبة السعر إلى الربح',
      dividendYield: 'عائد الأرباح',
      technicalRating: 'التقييم الفني',
      
      // Performance
      weeklyPerformance: 'الأداء الأسبوعي',
      monthlyPerformance: 'الأداء الشهري',
      yearlyPerformance: 'الأداء السنوي',
      
      // Technical indicators
      technicalIndicators: 'المؤشرات الفنية',
      rsi: 'مؤشر القوة النسبية',
      macd: 'مؤشر الماكد',
      movingAverages: 'المتوسطات المتحركة',
      bollingerBands: 'أشرطة بولينجر',
      
      // Financial metrics
      financialMetrics: 'المقاييس المالية',
      revenue: 'الإيرادات',
      profit: 'الربح',
      debt: 'الديون',
      equity: 'حقوق الملكية',
      
      // Common
      loading: 'جاري التحميل...',
      error: 'خطأ',
      noData: 'لا توجد بيانات متاحة',
      refresh: 'تحديث',
      search: 'بحث',
      filter: 'تصفية',
      sort: 'ترتيب',
      viewDetails: 'عرض التفاصيل'
    }
  };

  private languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇬🇧', direction: 'ltr' },
    { code: 'ar', name: 'العربية', flag: '🇪🇬', direction: 'rtl' }
  ];

  private currentLanguage = signal<Language>(this.getDefaultLanguage());

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadLanguageFromStorage();
  }

  getCurrentLanguage() {
    return this.currentLanguage.asReadonly();
  }

  getLanguages(): Language[] {
    return this.languages;
  }

  setLanguage(languageCode: string): void {
    const language = this.languages.find(lang => lang.code === languageCode);
    if (language) {
      this.currentLanguage.set(language);
      this.saveLanguageToStorage(languageCode);
      this.updateDocumentDirection(language.direction);
    }
  }

  getTranslation(key: keyof Translations): string {
    const currentLang = this.getCurrentLanguage()();
    return this.translations[currentLang.code]?.[key] || key;
  }

  getTranslations(): Translations {
    const currentLang = this.getCurrentLanguage()();
    return this.translations[currentLang.code] || this.translations['en'];
  }

  private getDefaultLanguage(): Language {
    return this.languages[0]; // Default to English
  }

  private loadLanguageFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        this.setLanguage(savedLanguage);
      }
    }
  }

  private saveLanguageToStorage(languageCode: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('selectedLanguage', languageCode);
    }
  }

  private updateDocumentDirection(direction: 'ltr' | 'rtl'): void {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.dir = direction;
      document.documentElement.lang = this.getCurrentLanguage()().code;
    }
  }
}

