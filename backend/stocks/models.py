from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Stock(models.Model):
    """Model to store comprehensive stock data"""
    
    # Basic Information
    symbol = models.CharField(max_length=20, unique=True, db_index=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=50, blank=True, null=True)
    currency = models.CharField(max_length=10, blank=True, null=True)
    exchange = models.CharField(max_length=50, blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    sector = models.CharField(max_length=100, blank=True, null=True)
    submarket = models.CharField(max_length=100, blank=True, null=True)
    subtype = models.CharField(max_length=100, blank=True, null=True)
    type_field = models.CharField(max_length=50, blank=True, null=True, db_column='type')
    logoid = models.CharField(max_length=100, blank=True, null=True)
    
    # Price Information
    price = models.FloatField(blank=True, null=True)
    open_price = models.FloatField(blank=True, null=True)
    high = models.FloatField(blank=True, null=True)
    low = models.FloatField(blank=True, null=True)
    close_price = models.FloatField(blank=True, null=True)
    change = models.FloatField(blank=True, null=True)
    change_percent = models.FloatField(blank=True, null=True)
    change_from_open = models.FloatField(blank=True, null=True)
    change_from_open_percent = models.FloatField(blank=True, null=True)
    gap_percent = models.FloatField(blank=True, null=True)
    
    # Volume Information
    volume = models.BigIntegerField(blank=True, null=True)
    volume_price = models.FloatField(blank=True, null=True)
    volume_weighted_average_price = models.FloatField(blank=True, null=True)
    relative_volume = models.FloatField(blank=True, null=True)
    relative_volume_at_time = models.FloatField(blank=True, null=True)
    
    # Performance Metrics
    weekly_performance = models.FloatField(blank=True, null=True)
    monthly_performance = models.FloatField(blank=True, null=True)
    yearly_performance = models.FloatField(blank=True, null=True)
    ytd_performance = models.FloatField(blank=True, null=True)
    five_year_performance = models.FloatField(blank=True, null=True)
    all_time_performance = models.FloatField(blank=True, null=True)
    three_month_performance = models.FloatField(blank=True, null=True)
    six_month_performance = models.FloatField(blank=True, null=True)
    
    # High/Low Records
    all_time_high = models.FloatField(blank=True, null=True)
    all_time_low = models.FloatField(blank=True, null=True)
    fifty_two_week_high = models.FloatField(blank=True, null=True)
    fifty_two_week_low = models.FloatField(blank=True, null=True)
    one_month_high = models.FloatField(blank=True, null=True)
    one_month_low = models.FloatField(blank=True, null=True)
    three_month_high = models.FloatField(blank=True, null=True)
    three_month_low = models.FloatField(blank=True, null=True)
    six_month_high = models.FloatField(blank=True, null=True)
    six_month_low = models.FloatField(blank=True, null=True)
    
    # Market Capitalization
    market_capitalization = models.FloatField(blank=True, null=True)
    enterprise_value = models.FloatField(blank=True, null=True)
    shares_outstanding = models.FloatField(blank=True, null=True)
    shares_float = models.FloatField(blank=True, null=True)
    
    # Valuation Ratios
    price_to_earnings_ratio_ttm = models.FloatField(blank=True, null=True)
    price_to_book_fy = models.FloatField(blank=True, null=True)
    price_to_book_mrq = models.FloatField(blank=True, null=True)
    price_to_sales_fy = models.FloatField(blank=True, null=True)
    price_to_revenue_ratio_ttm = models.FloatField(blank=True, null=True)
    price_to_free_cash_flow_ttm = models.FloatField(blank=True, null=True)
    enterprise_value_ebitda_ttm = models.FloatField(blank=True, null=True)
    
    # Financial Metrics
    basic_eps_fy = models.FloatField(blank=True, null=True)
    basic_eps_ttm = models.FloatField(blank=True, null=True)
    eps_diluted_fy = models.FloatField(blank=True, null=True)
    eps_diluted_mrq = models.FloatField(blank=True, null=True)
    eps_diluted_ttm = models.FloatField(blank=True, null=True)
    eps_forecast_mrq = models.FloatField(blank=True, null=True)
    
    # Growth Metrics
    revenue_annual_yoy_growth = models.FloatField(blank=True, null=True)
    revenue_quarterly_qoq_growth = models.FloatField(blank=True, null=True)
    revenue_quarterly_yoy_growth = models.FloatField(blank=True, null=True)
    revenue_ttm_yoy_growth = models.FloatField(blank=True, null=True)
    eps_diluted_annual_yoy_growth = models.FloatField(blank=True, null=True)
    eps_diluted_quarterly_qoq_growth = models.FloatField(blank=True, null=True)
    eps_diluted_quarterly_yoy_growth = models.FloatField(blank=True, null=True)
    eps_diluted_ttm_yoy_growth = models.FloatField(blank=True, null=True)
    ebitda_annual_yoy_growth = models.FloatField(blank=True, null=True)
    ebitda_quarterly_qoq_growth = models.FloatField(blank=True, null=True)
    ebitda_quarterly_yoy_growth = models.FloatField(blank=True, null=True)
    ebitda_ttm_yoy_growth = models.FloatField(blank=True, null=True)
    
    # Profitability Metrics
    gross_margin_fy = models.FloatField(blank=True, null=True)
    gross_margin_ttm = models.FloatField(blank=True, null=True)
    operating_margin_fy = models.FloatField(blank=True, null=True)
    operating_margin_ttm = models.FloatField(blank=True, null=True)
    net_margin_fy = models.FloatField(blank=True, null=True)
    net_margin_ttm = models.FloatField(blank=True, null=True)
    pretax_margin_ttm = models.FloatField(blank=True, null=True)
    free_cash_flow_margin_fy = models.FloatField(blank=True, null=True)
    free_cash_flow_margin_ttm = models.FloatField(blank=True, null=True)
    
    # Return Metrics
    return_on_assets_ttm = models.FloatField(blank=True, null=True)
    return_on_equity_ttm = models.FloatField(blank=True, null=True)
    return_on_invested_capital_ttm = models.FloatField(blank=True, null=True)
    
    # Debt Metrics
    debt_to_equity_ratio_mrq = models.FloatField(blank=True, null=True)
    current_ratio_mrq = models.FloatField(blank=True, null=True)
    quick_ratio_mrq = models.FloatField(blank=True, null=True)
    
    # Dividend Information
    dividend_yield_forward = models.FloatField(blank=True, null=True)
    dividends_per_share_fy = models.FloatField(blank=True, null=True)
    dividends_per_share_mrq = models.FloatField(blank=True, null=True)
    dividends_per_share_annual_yoy_growth = models.FloatField(blank=True, null=True)
    dividends_paid_fy = models.FloatField(blank=True, null=True)
    
    # Technical Indicators
    relative_strength_index_14 = models.FloatField(blank=True, null=True)
    relative_strength_index_7 = models.FloatField(blank=True, null=True)
    macd_level_12_26 = models.FloatField(blank=True, null=True)
    macd_signal_12_26 = models.FloatField(blank=True, null=True)
    stochastic_k_14_3_3 = models.FloatField(blank=True, null=True)
    stochastic_d_14_3_3 = models.FloatField(blank=True, null=True)
    stochastic_rsi_fast_3_3_14_14 = models.FloatField(blank=True, null=True)
    stochastic_rsi_slow_3_3_14_14 = models.FloatField(blank=True, null=True)
    williams_percent_range_14 = models.FloatField(blank=True, null=True)
    average_directional_index_14 = models.FloatField(blank=True, null=True)
    positive_directional_indicator_14 = models.FloatField(blank=True, null=True)
    negative_directional_indicator_14 = models.FloatField(blank=True, null=True)
    commodity_channel_index_20 = models.FloatField(blank=True, null=True)
    ultimate_oscillator_7_14_28 = models.FloatField(blank=True, null=True)
    awesome_oscillator = models.FloatField(blank=True, null=True)
    momentum_10 = models.FloatField(blank=True, null=True)
    rate_of_change_9 = models.FloatField(blank=True, null=True)
    bull_bear_power = models.FloatField(blank=True, null=True)
    
    # Moving Averages
    simple_moving_average_5 = models.FloatField(blank=True, null=True)
    simple_moving_average_10 = models.FloatField(blank=True, null=True)
    simple_moving_average_20 = models.FloatField(blank=True, null=True)
    simple_moving_average_30 = models.FloatField(blank=True, null=True)
    simple_moving_average_50 = models.FloatField(blank=True, null=True)
    simple_moving_average_100 = models.FloatField(blank=True, null=True)
    simple_moving_average_200 = models.FloatField(blank=True, null=True)
    exponential_moving_average_5 = models.FloatField(blank=True, null=True)
    exponential_moving_average_10 = models.FloatField(blank=True, null=True)
    exponential_moving_average_20 = models.FloatField(blank=True, null=True)
    exponential_moving_average_30 = models.FloatField(blank=True, null=True)
    exponential_moving_average_50 = models.FloatField(blank=True, null=True)
    exponential_moving_average_100 = models.FloatField(blank=True, null=True)
    exponential_moving_average_200 = models.FloatField(blank=True, null=True)
    hull_moving_average_9 = models.FloatField(blank=True, null=True)
    volume_weighted_moving_average_20 = models.FloatField(blank=True, null=True)
    
    # Bollinger Bands
    bollinger_upper_band_20 = models.FloatField(blank=True, null=True)
    bollinger_lower_band_20 = models.FloatField(blank=True, null=True)
    
    # Ichimoku Cloud
    ichimoku_conversion_line_9_26_52_26 = models.FloatField(blank=True, null=True)
    ichimoku_base_line_9_26_52_26 = models.FloatField(blank=True, null=True)
    ichimoku_leading_span_a_9_26_52_26 = models.FloatField(blank=True, null=True)
    ichimoku_leading_span_b_9_26_52_26 = models.FloatField(blank=True, null=True)
    
    # Other Technical Indicators
    parabolic_sar = models.FloatField(blank=True, null=True)
    average_true_range_14 = models.FloatField(blank=True, null=True)
    average_day_range_14 = models.FloatField(blank=True, null=True)
    volatility = models.FloatField(blank=True, null=True)
    volatility_week = models.FloatField(blank=True, null=True)
    volatility_month = models.FloatField(blank=True, null=True)
    aroon_up_14 = models.FloatField(blank=True, null=True)
    aroon_down_14 = models.FloatField(blank=True, null=True)
    money_flow_14 = models.FloatField(blank=True, null=True)
    chaikin_money_flow_20 = models.FloatField(blank=True, null=True)
    
    # Ratings
    technical_rating = models.FloatField(blank=True, null=True)
    oscillators_rating = models.FloatField(blank=True, null=True)
    moving_averages_rating = models.FloatField(blank=True, null=True)
    
    # Beta
    one_year_beta = models.FloatField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-market_capitalization']
        verbose_name = 'Stock'
        verbose_name_plural = 'Stocks'
    
    def __str__(self):
        return f"{self.symbol} - {self.name}"
    
    @property
    def is_bullish(self):
        """Determine if stock is bullish based on technical indicators"""
        bullish_signals = 0
        if self.relative_strength_index_14 and self.relative_strength_index_14 > 50:
            bullish_signals += 1
        if self.macd_level_12_26 and self.macd_signal_12_26 and self.macd_level_12_26 > self.macd_signal_12_26:
            bullish_signals += 1
        if self.change_percent and self.change_percent > 0:
            bullish_signals += 1
        if self.technical_rating and self.technical_rating > 0:
            bullish_signals += 1
        return bullish_signals >= 2
    
    @property
    def is_undervalued(self):
        """Determine if stock is undervalued"""
        if not self.price_to_earnings_ratio_ttm or not self.price_to_book_mrq:
            return False
        return (self.price_to_earnings_ratio_ttm > 0 and 
                self.price_to_earnings_ratio_ttm < 15 and
                self.price_to_book_mrq > 0 and 
                self.price_to_book_mrq < 3)
    
    @property
    def is_growth_stock(self):
        """Determine if stock is a growth stock"""
        growth_signals = 0
        if self.revenue_ttm_yoy_growth and self.revenue_ttm_yoy_growth > 10:
            growth_signals += 1
        if self.eps_diluted_ttm_yoy_growth and self.eps_diluted_ttm_yoy_growth > 10:
            growth_signals += 1
        if self.ebitda_ttm_yoy_growth and self.ebitda_ttm_yoy_growth > 10:
            growth_signals += 1
        return growth_signals >= 2
