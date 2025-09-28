#!/usr/bin/env python
"""
Script to populate the database with sample stock data for testing
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stock_api.settings')
django.setup()

from stocks.models import Stock
import random

def create_sample_stocks():
    """Create sample stock data for testing"""
    
    sample_stocks = [
        {
            'symbol': 'COMI',
            'name': 'Commercial International Bank',
            'description': 'Leading commercial bank in Egypt',
            'country': 'Egypt',
            'currency': 'EGP',
            'exchange': 'EGX',
            'industry': 'Banking',
            'sector': 'Financial Services',
            'price': 45.50,
            'change_percent': 2.5,
            'volume': 1500000,
            'market_capitalization': 50000000000,
            'price_to_earnings_ratio_ttm': 8.5,
            'technical_rating': 1.2,
            'weekly_performance': 3.2,
            'monthly_performance': 8.5,
            'yearly_performance': 15.3,
            'dividend_yield_forward': 4.2,
            'relative_strength_index_14': 65.5,
            'macd_level_12_26': 0.8,
            'macd_signal_12_26': 0.6,
            'revenue_ttm_yoy_growth': 12.5,
            'eps_diluted_ttm_yoy_growth': 8.3,
            'return_on_equity_ttm': 18.5,
            'gross_margin_ttm': 45.2,
            'operating_margin_ttm': 25.8,
            'net_margin_ttm': 15.3,
        },
        {
            'symbol': 'ORAS',
            'name': 'Orascom Construction',
            'description': 'Leading construction and engineering company',
            'country': 'Egypt',
            'currency': 'EGP',
            'exchange': 'EGX',
            'industry': 'Construction',
            'sector': 'Industrials',
            'price': 12.80,
            'change_percent': -1.2,
            'volume': 800000,
            'market_capitalization': 8000000000,
            'price_to_earnings_ratio_ttm': 12.3,
            'technical_rating': -0.8,
            'weekly_performance': -2.1,
            'monthly_performance': -5.3,
            'yearly_performance': 8.7,
            'dividend_yield_forward': 2.1,
            'relative_strength_index_14': 35.2,
            'macd_level_12_26': -0.3,
            'macd_signal_12_26': -0.1,
            'revenue_ttm_yoy_growth': 5.8,
            'eps_diluted_ttm_yoy_growth': 3.2,
            'return_on_equity_ttm': 12.3,
            'gross_margin_ttm': 28.5,
            'operating_margin_ttm': 15.2,
            'net_margin_ttm': 8.7,
        },
        {
            'symbol': 'EFID',
            'name': 'EFG Hermes Holding',
            'description': 'Leading investment bank and financial services',
            'country': 'Egypt',
            'currency': 'EGP',
            'exchange': 'EGX',
            'industry': 'Investment Banking',
            'sector': 'Financial Services',
            'price': 18.90,
            'change_percent': 4.8,
            'volume': 1200000,
            'market_capitalization': 12000000000,
            'price_to_earnings_ratio_ttm': 15.2,
            'technical_rating': 2.1,
            'weekly_performance': 6.5,
            'monthly_performance': 12.8,
            'yearly_performance': 22.5,
            'dividend_yield_forward': 3.8,
            'relative_strength_index_14': 72.3,
            'macd_level_12_26': 1.2,
            'macd_signal_12_26': 0.9,
            'revenue_ttm_yoy_growth': 18.7,
            'eps_diluted_ttm_yoy_growth': 15.3,
            'return_on_equity_ttm': 22.1,
            'gross_margin_ttm': 52.8,
            'operating_margin_ttm': 32.5,
            'net_margin_ttm': 18.9,
        },
        {
            'symbol': 'PHDC',
            'name': 'Palm Hills Development',
            'description': 'Real estate development company',
            'country': 'Egypt',
            'currency': 'EGP',
            'exchange': 'EGX',
            'industry': 'Real Estate',
            'sector': 'Real Estate',
            'price': 2.15,
            'change_percent': 0.5,
            'volume': 2000000,
            'market_capitalization': 3500000000,
            'price_to_earnings_ratio_ttm': 6.8,
            'technical_rating': 0.3,
            'weekly_performance': 1.2,
            'monthly_performance': 3.5,
            'yearly_performance': -5.2,
            'dividend_yield_forward': 5.5,
            'relative_strength_index_14': 48.7,
            'macd_level_12_26': 0.1,
            'macd_signal_12_26': 0.2,
            'revenue_ttm_yoy_growth': -2.3,
            'eps_diluted_ttm_yoy_growth': -8.5,
            'return_on_equity_ttm': 8.9,
            'gross_margin_ttm': 35.2,
            'operating_margin_ttm': 18.7,
            'net_margin_ttm': 12.3,
        },
        {
            'symbol': 'SWDY',
            'name': 'El Sewedy Electric',
            'description': 'Electrical equipment and infrastructure company',
            'country': 'Egypt',
            'currency': 'EGP',
            'exchange': 'EGX',
            'industry': 'Electrical Equipment',
            'sector': 'Industrials',
            'price': 25.40,
            'change_percent': 3.2,
            'volume': 950000,
            'market_capitalization': 15000000000,
            'price_to_earnings_ratio_ttm': 9.8,
            'technical_rating': 1.5,
            'weekly_performance': 4.8,
            'monthly_performance': 9.2,
            'yearly_performance': 18.7,
            'dividend_yield_forward': 2.8,
            'relative_strength_index_14': 68.9,
            'macd_level_12_26': 0.9,
            'macd_signal_12_26': 0.7,
            'revenue_ttm_yoy_growth': 15.3,
            'eps_diluted_ttm_yoy_growth': 12.7,
            'return_on_equity_ttm': 16.8,
            'gross_margin_ttm': 42.5,
            'operating_margin_ttm': 22.3,
            'net_margin_ttm': 13.7,
        }
    ]
    
    # Clear existing data
    Stock.objects.all().delete()
    
    # Create sample stocks
    for stock_data in sample_stocks:
        # Add some random variations to make data more realistic
        stock_data['open_price'] = stock_data['price'] * (1 + random.uniform(-0.02, 0.02))
        stock_data['high'] = stock_data['price'] * (1 + random.uniform(0, 0.05))
        stock_data['low'] = stock_data['price'] * (1 - random.uniform(0, 0.05))
        stock_data['close_price'] = stock_data['price']
        stock_data['change'] = stock_data['price'] * (stock_data['change_percent'] / 100)
        
        # Add technical indicators
        stock_data['stochastic_k_14_3_3'] = random.uniform(20, 80)
        stock_data['stochastic_d_14_3_3'] = stock_data['stochastic_k_14_3_3'] + random.uniform(-5, 5)
        stock_data['williams_percent_range_14'] = random.uniform(-80, -20)
        stock_data['average_directional_index_14'] = random.uniform(15, 45)
        stock_data['commodity_channel_index_20'] = random.uniform(-100, 100)
        stock_data['ultimate_oscillator_7_14_28'] = random.uniform(30, 70)
        stock_data['awesome_oscillator'] = random.uniform(-2, 2)
        stock_data['momentum_10'] = random.uniform(-5, 5)
        stock_data['rate_of_change_9'] = random.uniform(-10, 10)
        stock_data['bull_bear_power'] = random.uniform(-3, 3)
        
        # Add moving averages
        stock_data['simple_moving_average_5'] = stock_data['price'] * (1 + random.uniform(-0.03, 0.03))
        stock_data['simple_moving_average_10'] = stock_data['price'] * (1 + random.uniform(-0.05, 0.05))
        stock_data['simple_moving_average_20'] = stock_data['price'] * (1 + random.uniform(-0.08, 0.08))
        stock_data['simple_moving_average_50'] = stock_data['price'] * (1 + random.uniform(-0.12, 0.12))
        stock_data['simple_moving_average_100'] = stock_data['price'] * (1 + random.uniform(-0.15, 0.15))
        stock_data['simple_moving_average_200'] = stock_data['price'] * (1 + random.uniform(-0.20, 0.20))
        
        # Add financial metrics
        stock_data['price_to_book_mrq'] = random.uniform(0.5, 3.0)
        stock_data['price_to_sales_fy'] = random.uniform(0.5, 5.0)
        stock_data['enterprise_value_ebitda_ttm'] = random.uniform(5, 25)
        stock_data['debt_to_equity_ratio_mrq'] = random.uniform(0.1, 2.0)
        stock_data['current_ratio_mrq'] = random.uniform(1.0, 3.0)
        stock_data['quick_ratio_mrq'] = random.uniform(0.5, 2.0)
        
        # Add growth metrics
        stock_data['revenue_annual_yoy_growth'] = random.uniform(-10, 30)
        stock_data['revenue_quarterly_qoq_growth'] = random.uniform(-5, 15)
        stock_data['revenue_quarterly_yoy_growth'] = random.uniform(-8, 25)
        stock_data['eps_diluted_annual_yoy_growth'] = random.uniform(-15, 35)
        stock_data['eps_diluted_quarterly_qoq_growth'] = random.uniform(-8, 20)
        stock_data['eps_diluted_quarterly_yoy_growth'] = random.uniform(-12, 30)
        stock_data['ebitda_annual_yoy_growth'] = random.uniform(-10, 40)
        stock_data['ebitda_quarterly_qoq_growth'] = random.uniform(-5, 20)
        stock_data['ebitda_quarterly_yoy_growth'] = random.uniform(-8, 35)
        stock_data['ebitda_ttm_yoy_growth'] = random.uniform(-5, 25)
        
        # Add profitability metrics
        stock_data['gross_margin_fy'] = random.uniform(20, 60)
        stock_data['operating_margin_fy'] = random.uniform(10, 40)
        stock_data['net_margin_fy'] = random.uniform(5, 25)
        stock_data['pretax_margin_ttm'] = random.uniform(8, 30)
        stock_data['free_cash_flow_margin_fy'] = random.uniform(5, 20)
        stock_data['free_cash_flow_margin_ttm'] = random.uniform(3, 18)
        
        # Add return metrics
        stock_data['return_on_assets_ttm'] = random.uniform(5, 25)
        stock_data['return_on_invested_capital_ttm'] = random.uniform(8, 30)
        
        # Add dividend information
        stock_data['dividends_per_share_fy'] = stock_data['price'] * (stock_data['dividend_yield_forward'] / 100)
        stock_data['dividends_per_share_mrq'] = stock_data['dividends_per_share_fy'] / 4
        stock_data['dividends_per_share_annual_yoy_growth'] = random.uniform(-5, 15)
        stock_data['dividends_paid_fy'] = stock_data['dividends_per_share_fy'] * random.uniform(1000000, 10000000)
        
        # Add volatility and beta
        stock_data['volatility'] = random.uniform(15, 45)
        stock_data['volatility_week'] = random.uniform(10, 30)
        stock_data['volatility_month'] = random.uniform(20, 50)
        stock_data['one_year_beta'] = random.uniform(0.5, 1.8)
        
        # Add shares information
        stock_data['shares_outstanding'] = stock_data['market_capitalization'] / stock_data['price']
        stock_data['shares_float'] = stock_data['shares_outstanding'] * random.uniform(0.7, 0.95)
        
        # Add enterprise value
        stock_data['enterprise_value'] = stock_data['market_capitalization'] * random.uniform(0.8, 1.2)
        
        # Add EPS information
        stock_data['basic_eps_fy'] = stock_data['price'] / stock_data['price_to_earnings_ratio_ttm']
        stock_data['basic_eps_ttm'] = stock_data['basic_eps_fy'] * random.uniform(0.9, 1.1)
        stock_data['eps_diluted_fy'] = stock_data['basic_eps_fy'] * random.uniform(0.95, 1.0)
        stock_data['eps_diluted_mrq'] = stock_data['eps_diluted_fy'] / 4
        stock_data['eps_diluted_ttm'] = stock_data['eps_diluted_fy'] * random.uniform(0.9, 1.1)
        stock_data['eps_forecast_mrq'] = stock_data['eps_diluted_mrq'] * random.uniform(0.8, 1.2)
        
        # Add high/low records
        stock_data['all_time_high'] = stock_data['price'] * random.uniform(1.2, 2.0)
        stock_data['all_time_low'] = stock_data['price'] * random.uniform(0.3, 0.8)
        stock_data['fifty_two_week_high'] = stock_data['price'] * random.uniform(1.1, 1.5)
        stock_data['fifty_two_week_low'] = stock_data['price'] * random.uniform(0.6, 0.9)
        stock_data['one_month_high'] = stock_data['price'] * random.uniform(1.02, 1.15)
        stock_data['one_month_low'] = stock_data['price'] * random.uniform(0.85, 0.98)
        stock_data['three_month_high'] = stock_data['price'] * random.uniform(1.05, 1.25)
        stock_data['three_month_low'] = stock_data['price'] * random.uniform(0.75, 0.95)
        stock_data['six_month_high'] = stock_data['price'] * random.uniform(1.1, 1.4)
        stock_data['six_month_low'] = stock_data['price'] * random.uniform(0.7, 0.9)
        
        # Add performance metrics
        stock_data['three_month_performance'] = random.uniform(-15, 25)
        stock_data['six_month_performance'] = random.uniform(-20, 35)
        stock_data['ytd_performance'] = random.uniform(-25, 40)
        stock_data['five_year_performance'] = random.uniform(-30, 150)
        stock_data['all_time_performance'] = random.uniform(-50, 300)
        
        # Add ratings
        stock_data['oscillators_rating'] = random.uniform(-2, 2)
        stock_data['moving_averages_rating'] = random.uniform(-2, 2)
        
        # Add Bollinger Bands
        stock_data['bollinger_upper_band_20'] = stock_data['price'] * random.uniform(1.02, 1.08)
        stock_data['bollinger_lower_band_20'] = stock_data['price'] * random.uniform(0.92, 0.98)
        
        # Add Ichimoku Cloud
        stock_data['ichimoku_conversion_line_9_26_52_26'] = stock_data['price'] * random.uniform(0.98, 1.02)
        stock_data['ichimoku_base_line_9_26_52_26'] = stock_data['price'] * random.uniform(0.97, 1.03)
        stock_data['ichimoku_leading_span_a_9_26_52_26'] = stock_data['price'] * random.uniform(0.95, 1.05)
        stock_data['ichimoku_leading_span_b_9_26_52_26'] = stock_data['price'] * random.uniform(0.94, 1.06)
        
        # Add other technical indicators
        stock_data['parabolic_sar'] = stock_data['price'] * random.uniform(0.95, 1.05)
        stock_data['average_true_range_14'] = stock_data['price'] * random.uniform(0.01, 0.05)
        stock_data['average_day_range_14'] = stock_data['price'] * random.uniform(0.02, 0.08)
        stock_data['aroon_up_14'] = random.uniform(20, 100)
        stock_data['aroon_down_14'] = random.uniform(0, 80)
        stock_data['money_flow_14'] = random.uniform(-50, 50)
        stock_data['chaikin_money_flow_20'] = random.uniform(-0.3, 0.3)
        
        # Add Hull Moving Average
        stock_data['hull_moving_average_9'] = stock_data['price'] * random.uniform(0.98, 1.02)
        
        # Add Volume Weighted Moving Average
        stock_data['volume_weighted_moving_average_20'] = stock_data['price'] * random.uniform(0.97, 1.03)
        
        # Add Volume Weighted Average Price
        stock_data['volume_weighted_average_price'] = stock_data['price'] * random.uniform(0.99, 1.01)
        
        # Add Relative Volume
        stock_data['relative_volume'] = random.uniform(0.5, 3.0)
        stock_data['relative_volume_at_time'] = random.uniform(0.3, 2.5)
        
        # Add Volume Price
        stock_data['volume_price'] = stock_data['price'] * stock_data['volume']
        
        # Add Change from Open
        stock_data['change_from_open'] = stock_data['price'] - stock_data['open_price']
        stock_data['change_from_open_percent'] = (stock_data['change_from_open'] / stock_data['open_price']) * 100
        
        # Add Gap Percent
        stock_data['gap_percent'] = random.uniform(-2, 2)
        
        # Add Price to Revenue Ratio
        stock_data['price_to_revenue_ratio_ttm'] = random.uniform(0.5, 8.0)
        
        # Add Price to Free Cash Flow
        stock_data['price_to_free_cash_flow_ttm'] = random.uniform(5, 50)
        
        # Add Price to Book FY
        stock_data['price_to_book_fy'] = random.uniform(0.3, 4.0)
        
        # Add additional fields that exist in the model
        stock_data['relative_strength_index_7'] = random.uniform(30, 70)
        stock_data['stochastic_rsi_fast_3_3_14_14'] = random.uniform(20, 80)
        stock_data['stochastic_rsi_slow_3_3_14_14'] = random.uniform(20, 80)
        stock_data['positive_directional_indicator_14'] = random.uniform(15, 45)
        stock_data['negative_directional_indicator_14'] = random.uniform(15, 45)
        
        # Add exponential moving averages
        stock_data['exponential_moving_average_5'] = stock_data['price'] * (1 + random.uniform(-0.03, 0.03))
        stock_data['exponential_moving_average_10'] = stock_data['price'] * (1 + random.uniform(-0.05, 0.05))
        stock_data['exponential_moving_average_20'] = stock_data['price'] * (1 + random.uniform(-0.08, 0.08))
        stock_data['exponential_moving_average_30'] = stock_data['price'] * (1 + random.uniform(-0.10, 0.10))
        stock_data['exponential_moving_average_50'] = stock_data['price'] * (1 + random.uniform(-0.12, 0.12))
        stock_data['exponential_moving_average_100'] = stock_data['price'] * (1 + random.uniform(-0.15, 0.15))
        stock_data['exponential_moving_average_200'] = stock_data['price'] * (1 + random.uniform(-0.20, 0.20))
        
        # Add simple moving averages
        stock_data['simple_moving_average_30'] = stock_data['price'] * (1 + random.uniform(-0.10, 0.10))
        
        # Create the stock object
        stock = Stock.objects.create(**stock_data)
        print(f"Created stock: {stock.symbol} - {stock.name}")

if __name__ == '__main__':
    create_sample_stocks()
    print("Sample stock data created successfully!")