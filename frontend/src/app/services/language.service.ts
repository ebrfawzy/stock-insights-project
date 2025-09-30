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
  changeLanguage: string;
  light: string;
  dark: string;
  themeToggleTitle: string;

  // Landing page
  welcomeTitle: string;
  welcomeSubtitle: string;
  getStarted: string;
  exploreStocks: string;
  keyFeatures: string;
  featureRealTimeDataTitle: string;
  featureRealTimeDataDesc: string;
  featureSmartInsightsTitle: string;
  featureSmartInsightsDesc: string;
  featureTechnicalAnalysisTitle: string;
  featureTechnicalAnalysisDesc: string;
  featureInvestmentStrategiesTitle: string;
  featureInvestmentStrategiesDesc: string;
  marketOverview: string;
  statsStocksTracked: string;
  statsRealTimeUpdates: string;
  statsTechnicalIndicators: string;
  statsFreeAccess: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
  footerTagline: string;
  quickLinks: string;
  marketInsightsLink: string;
  stockListLink: string;
  aboutUs: string;
  contact: string;
  rightsReserved: string;

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
  insightsSubtitle: string;
  totalStocks: string;
  totalMarketCap: string;
  averagePERatio: string;
  averageVolume: string;
  rating: string;
  unknown: string;
  volumeShort: string;
  relVol: string;
  topSectorsChange: string;
  noSectorData: string;
  topPositiveMovers: string;
  topNegativeMovers: string;
  noPositiveMovers: string;
  noNegativeMovers: string;
  bullish: string;
  bearish: string;

  // Stock details
  stockDetails: string;
  price: string;
  change: string;
  volume: string;
  marketCap: string;
  peRatio: string;
  dividendYield: string;
  technicalRating: string;
  breadcrumbHome: string;
  breadcrumbStocks: string;
  keyMetrics: string;
  open: string;
  high: string;
  low: string;
  performance: string;
  additionalPerformance: string;
  ytdPerformance: string;
  threeMonthPerformance: string;
  sixMonthPerformance: string;
  fiveYearPerformance: string;
  allTimePerformance: string;
  highLowRecords: string;

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
  // Stocks list page
  pageStockListTitle: string;
  pageStockListSubtitle: string;
  searchPlaceholder: string;
  sector: string;
  allSectors: string;
  industry: string;
  allIndustries: string;
  sortBy: string;
  marketCapShort: string;
  symbol: string;
  actions: string;
  previous: string;
  next: string;
  noStocksFound: string;
  clearFilters: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translations: Record<string, Translations> = {
    'en-GB': {
      // Navigation
      home: 'Home',
      insights: 'Insights',
      stocks: 'Stocks',
      about: 'About',
      changeLanguage: 'Change Language',
      light: 'Light',
      dark: 'Dark',
      themeToggleTitle: 'Toggle theme',

      // Landing page
      welcomeTitle: 'Egyptian Stock Market Insights',
      welcomeSubtitle: 'Discover comprehensive analysis and insights for Egyptian stocks',
      getStarted: 'Get Started',
      exploreStocks: 'Explore Stocks',
      keyFeatures: 'Key Features',
      featureRealTimeDataTitle: 'Real-time Data',
      featureRealTimeDataDesc: 'Get up-to-date stock prices and market data from the Egyptian stock exchange',
      featureSmartInsightsTitle: 'Smart Insights',
      featureSmartInsightsDesc: 'AI-powered analysis to identify bullish, bearish, and value opportunities',
      featureTechnicalAnalysisTitle: 'Technical Analysis',
      featureTechnicalAnalysisDesc: 'Comprehensive technical indicators and charting tools for informed decisions',
      featureInvestmentStrategiesTitle: 'Investment Strategies',
      featureInvestmentStrategiesDesc: 'Find the best stocks for short, medium, and long-term investment horizons',
      marketOverview: 'Market Overview',
      statsStocksTracked: 'Stocks Tracked',
      statsRealTimeUpdates: 'Real-time Updates',
      statsTechnicalIndicators: 'Technical Indicators',
      statsFreeAccess: 'Free Access',
      ctaTitle: 'Ready to Start Investing?',
      ctaSubtitle: 'Join thousands of investors who trust our insights for their Egyptian stock market decisions',
      ctaButton: 'Start Analyzing Now',
      footerTagline: 'Your trusted partner for Egyptian stock market analysis',
      quickLinks: 'Quick Links',
      marketInsightsLink: 'Market Insights',
      stockListLink: 'Stock List',
      aboutUs: 'About Us',
      contact: 'Contact',
      rightsReserved: 'All rights reserved.',

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
      insightsSubtitle: 'Comprehensive analysis of the Egyptian stock market',
      totalStocks: 'Total Stocks',
      totalMarketCap: 'Total Market Cap',
      averagePERatio: 'Average P/E Ratio',
      averageVolume: 'Average Volume',
      rating: 'Rating',
      unknown: 'Unknown',
      volumeShort: 'Volume',
      relVol: 'Rel Vol',
      topSectorsChange: 'Top Sectors Change',
      noSectorData: 'No sector data available at the moment.',
      topPositiveMovers: 'Top +ve Movers',
      topNegativeMovers: 'Top -ve Movers',
      noPositiveMovers: 'No positive movers available at the moment.',
      noNegativeMovers: 'No negative movers available at the moment.',
      bullish: 'Bullish',
      bearish: 'Bearish',

      // Stock details
      stockDetails: 'Stock Details',
      price: 'Price',
      change: 'Change',
      volume: 'Volume',
      marketCap: 'Market Cap',
      peRatio: 'P/E Ratio',
      dividendYield: 'Dividend Yield',
      technicalRating: 'Technical Rating',
      breadcrumbHome: 'Home',
      breadcrumbStocks: 'Stocks',
      keyMetrics: 'Key Metrics',
      open: 'Open',
      high: 'High',
      low: 'Low',
      performance: 'Performance',
      additionalPerformance: 'Additional Performance',
      ytdPerformance: 'YTD Performance',
      threeMonthPerformance: '3 Month Performance',
      sixMonthPerformance: '6 Month Performance',
      fiveYearPerformance: '5 Year Performance',
      allTimePerformance: 'All Time Performance',
      highLowRecords: 'High/Low Records',

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
      viewDetails: 'View Details',
      // Stocks list page
      pageStockListTitle: 'Stock List',
      pageStockListSubtitle: 'Browse and analyse all Egyptian stocks',
      searchPlaceholder: 'Search by symbol or name...',
      sector: 'Sector',
      allSectors: 'All Sectors',
      industry: 'Industry',
      allIndustries: 'All Industries',
      sortBy: 'Sort by',
      marketCapShort: 'Market Cap',
      symbol: 'Symbol',
      actions: 'Actions',
      previous: 'Previous',
      next: 'Next',
      noStocksFound: 'No stocks found matching your criteria',
      clearFilters: 'Clear Filters'
    },
    'ar-EG': {
      // Navigation
      home: 'الرئيسية',
      insights: 'تحليلات السوق',
      stocks: 'الأسهم',
      about: 'من نحن',
      changeLanguage: 'تغيير اللغة',
      light: 'فاتح',
      dark: 'داكن',
      themeToggleTitle: 'تبديل السمة',

      // Landing page
      welcomeTitle: 'تحليلات سوق الأسهم المصرية',
      welcomeSubtitle: 'اكتشف تحليلات ورؤى متعمقة عن الأسهم المصرية',
      getStarted: 'ابدأ الآن',
      exploreStocks: 'استكشف الأسهم',
      keyFeatures: 'أهم المميزات',
      featureRealTimeDataTitle: 'بيانات مباشرة',
      featureRealTimeDataDesc: 'تابع أسعار الأسهم وبيانات السوق مباشرة من البورصة المصرية',
      featureSmartInsightsTitle: 'رؤى ذكية',
      featureSmartInsightsDesc: 'تحليلات مدعومة بالذكاء الاصطناعي لاكتشاف فرص الصعود أو الهبوط وقيم الصفقات',
      featureTechnicalAnalysisTitle: 'التحليل الفني',
      featureTechnicalAnalysisDesc: 'مؤشرات فنية وأدوات رسم بياني متقدمة لاتخاذ قرارات مدروسة',
      featureInvestmentStrategiesTitle: 'استراتيجيات استثمار',
      featureInvestmentStrategiesDesc: 'اختَر الأسهم المناسبة للأجل القصير والمتوسط والطويل',
      marketOverview: 'نظرة عامة على السوق',
      statsStocksTracked: 'الأسهم المتتبعة',
      statsRealTimeUpdates: 'تحديثات مباشرة',
      statsTechnicalIndicators: 'المؤشرات الفنية',
      statsFreeAccess: 'دخول مجاني',
      ctaTitle: 'جاهز تبدأ الاستثمار؟',
      ctaSubtitle: 'انضم لآلاف المستثمرين اللي بيعتمدوا على تحليلاتنا لاتخاذ قراراتهم في السوق المصرية',
      ctaButton: 'ابدأ التحليل الآن',
      footerTagline: 'شريكك الموثوق في تحليل سوق الأسهم المصرية',
      quickLinks: 'روابط سريعة',
      marketInsightsLink: 'تحليلات السوق',
      stockListLink: 'قائمة الأسهم',
      aboutUs: 'من نحن',
      contact: 'تواصل معنا',
      rightsReserved: 'جميع الحقوق محفوظة.',

      // Insights page
      marketInsights: 'تحليلات السوق',
      topBullish: 'أقوى الأسهم الصاعدة',
      topBearish: 'أقوى الأسهم الهابطة',
      bestShortTerm: 'مناسب للاستثمار قصير الأجل (أسبوع)',
      bestMediumTerm: 'مناسب للاستثمار متوسط الأجل (شهر)',
      bestLongTerm: 'مناسب للاستثمار طويل الأجل (سنة)',
      overpriced: 'أسهم ذات قيمة مبالغ فيها',
      underpriced: 'أسهم مقوّمة بأقل من قيمتها',
      volumeLeaders: 'قادة حجم التداول',
      momentumStocks: 'أسهم ذات زخم',
      dividendStocks: 'أسهم توزيعات',
      growthStocks: 'أسهم نمو',
      insightsSubtitle: 'تحليل شامل ومُحدث لسوق الأسهم المصرية',
      totalStocks: 'إجمالي الأسهم',
      totalMarketCap: 'إجمالي القيمة السوقية',
      averagePERatio: 'متوسط نسبة السعر/الربح (P/E)',
      averageVolume: 'متوسط حجم التداول',
      rating: 'التقييم',
      unknown: 'غير متاح',
      volumeShort: 'حجم التداول',
      relVol: 'الحجم النسبي',
      topSectorsChange: 'أبرز القطاعات من حيث التغير',
      noSectorData: 'لا توجد بيانات للقطاعات حالياً.',
      topPositiveMovers: 'أكبر الرابحين',
      topNegativeMovers: 'أكبر الخاسرين',
      noPositiveMovers: 'لا توجد تحركات إيجابية حالياً.',
      noNegativeMovers: 'لا توجد تحركات سلبية حالياً.',
      bullish: 'صاعد',
      bearish: 'هابط',

      // Stock details
      stockDetails: 'تفاصيل السهم',
      price: 'السعر',
      change: 'التغير',
      volume: 'حجم التداول',
      marketCap: 'القيمة السوقية',
      peRatio: 'نسبة السعر/الربح (P/E)',
      dividendYield: 'عائد التوزيعات',
      technicalRating: 'التقييم الفني',
      breadcrumbHome: 'الرئيسية',
      breadcrumbStocks: 'الأسهم',
      keyMetrics: 'المؤشرات الرئيسية',
      open: 'سعر الافتتاح',
      high: 'أعلى سعر',
      low: 'أدنى سعر',
      performance: 'الأداء',
      additionalPerformance: 'أداء إضافي',
      ytdPerformance: 'الأداء منذ بداية العام (YTD)',
      threeMonthPerformance: 'أداء 3 أشهر',
      sixMonthPerformance: 'أداء 6 أشهر',
      fiveYearPerformance: 'أداء 5 سنوات',
      allTimePerformance: 'الأداء منذ الإدراج',
      highLowRecords: 'سجلات أعلى/أدنى',

      // Performance
      weeklyPerformance: 'الأداء الأسبوعي',
      monthlyPerformance: 'الأداء الشهري',
      yearlyPerformance: 'الأداء السنوي',

      // Technical indicators
      technicalIndicators: 'المؤشرات الفنية',
      rsi: 'مؤشر القوة النسبية (RSI)',
      macd: 'مؤشر الماكد (MACD)',
      movingAverages: 'المتوسطات المتحركة',
      bollingerBands: 'نطاقات بولينجر',

      // Financial metrics
      financialMetrics: 'المقاييس المالية',
      revenue: 'الإيرادات',
      profit: 'صافي الربح',
      debt: 'الديون',
      equity: 'حقوق الملكية',

      // Common
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      noData: 'لا توجد بيانات',
      refresh: 'تحديث',
      search: 'بحث',
      filter: 'تصفية',
      sort: 'ترتيب',
      viewDetails: 'عرض التفاصيل',
      // Stocks list page
      pageStockListTitle: 'قائمة الأسهم',
      pageStockListSubtitle: 'تصفح وحلل جميع الأسهم المصرية',
      searchPlaceholder: 'ابحث برمز أو اسم السهم...',
      sector: 'القطاع',
      allSectors: 'جميع القطاعات',
      industry: 'الصناعة',
      allIndustries: 'جميع الصناعات',
      sortBy: 'ترتيب حسب',
      marketCapShort: 'القيمة السوقية',
      symbol: 'الرمز',
      actions: 'الإجراءات',
      previous: 'السابق',
      next: 'التالي',
      noStocksFound: 'لم يتم العثور على أسهم تطابق معايير البحث.',
      clearFilters: 'مسح عوامل التصفية'
    }
  };

  private languages: Language[] = [
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧', direction: 'ltr' },
    { code: 'ar-EG', name: 'العربية (مصر)', flag: '🇪🇬', direction: 'rtl' }
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
    // Migration support for old codes
    const normalizedCode = languageCode === 'en' ? 'en-GB' : (languageCode === 'ar' ? 'ar-EG' : languageCode);
    const language = this.languages.find(lang => lang.code === normalizedCode);
    if (language) {
      this.currentLanguage.set(language);
      this.saveLanguageToStorage(language.code);
      this.updateDocumentDirection(language.direction);
    }
  }

  getTranslation(key: keyof Translations): string {
    const currentLang = this.getCurrentLanguage()();
    return this.translations[currentLang.code]?.[key] || this.translations['en-GB'][key] || (key as string);
  }

  getTranslations(): Translations {
    const currentLang = this.getCurrentLanguage()();
    return this.translations[currentLang.code] || this.translations['en-GB'];
  }

  private getDefaultLanguage(): Language {
    return this.languages[0]; // Default to English (UK)
  }

  private loadLanguageFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        // Migrate legacy codes if necessary
        const migrated = savedLanguage === 'en' ? 'en-GB' : (savedLanguage === 'ar' ? 'ar-EG' : savedLanguage);
        this.setLanguage(migrated);
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

