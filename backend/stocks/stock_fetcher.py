"""
Stock data fetcher using tvscreener
"""

import tvscreener as tvs
import pandas as pd
import numpy as np
from datetime import datetime
import json
import threading
import time


class StockDataFetcher:
    @staticmethod
    def get_sample_data():
        """Return sample stock data for fallback"""
        sample_data = {
            'Symbol': ['COMI', 'ORAS', 'EFID', 'PHDC', 'SWDY'],
            'Name': [
                'Commercial International Bank',
                'Orascom Construction',
                'EFG Hermes Holding',
                'Palm Hills Development',
                'El Sewedy Electric'
            ],
            'Price': [45.50, 12.80, 18.90, 2.15, 25.40],
            'Change %': [2.5, -1.2, 4.8, 0.5, 3.2],
            'Volume': [1500000, 800000, 1200000, 2000000, 950000],
            'Market Capitalization': [50000000000, 8000000000, 12000000000, 3500000000, 15000000000],
            'Price to Earnings Ratio (TTM)': [8.5, 12.3, 15.2, 6.8, 9.8],
            'Technical Rating': [1.2, -0.8, 2.1, 0.3, 1.5],
            'Performance (Week)': [3.2, -2.1, 6.5, 1.2, 4.8],
            'Performance (Month)': [8.5, -5.3, 12.8, 3.5, 9.2],
            'Performance (Year)': [15.3, 8.7, 22.5, -5.2, 18.7],
            'Sector': ['Financial Services', 'Industrials', 'Financial Services', 'Real Estate', 'Industrials'],
            'Industry': ['Banking', 'Construction', 'Investment Banking', 'Real Estate', 'Electrical Equipment']
        }
        return pd.DataFrame(sample_data)

    @staticmethod
    def fetch_egypt_stocks():
        """Fetch Egyptian stock market data with timeout and fallback"""
        def fetch_data():
            """Internal function to fetch data"""
            try:
                ss = tvs.StockScreener()
                ss.set_markets(tvs.Market.EGYPT)
                ss.set_range(0, 500)
                return ss.get()
            except Exception as e:
                print(f"Error in fetch_data: {e}")
                return None

        print("Attempting to fetch stock data from tvscreener...")
        
        # Use threading to implement timeout
        result = [None]
        exception = [None]
        
        def target():
            try:
                result[0] = fetch_data()
            except Exception as e:
                exception[0] = e
        
        thread = threading.Thread(target=target)
        thread.daemon = True
        thread.start()
        thread.join(timeout=10)  # 10-second timeout
        
        if thread.is_alive():
            print("tvscreener request timed out after 10 seconds")
            print("Using sample data as fallback...")
            return StockDataFetcher.get_sample_data()
        
        if exception[0]:
            print(f"Error fetching stock data from tvscreener: {exception[0]}")
            print("Using sample data as fallback...")
            return StockDataFetcher.get_sample_data()
        
        if result[0] is not None and not result[0].empty:
            print(f"Successfully fetched {len(result[0])} stocks from tvscreener")
            return result[0]
        else:
            print("No data received from tvscreener")
            print("Using sample data as fallback...")
            return StockDataFetcher.get_sample_data()

    @staticmethod
    def process_stock_insights(stocks_df):
        """Process stock data to generate insights"""
        if stocks_df.empty:
            return {}

        # Clean data - replace inf and nan values
        stocks_df = stocks_df.replace([np.inf, -np.inf], np.nan)

        insights = {
            "timestamp": datetime.now().isoformat(),
            "total_stocks": len(stocks_df),
            "market_overview": {
                "total_market_cap": (
                    float(stocks_df["Market Capitalization"].sum())
                    if "Market Capitalization" in stocks_df
                    else 0
                ),
                "average_pe_ratio": (
                    float(stocks_df["Price to Earnings Ratio (TTM)"].mean())
                    if "Price to Earnings Ratio (TTM)" in stocks_df
                    else 0
                ),
                "average_volume": (
                    float(stocks_df["Volume"].mean()) if "Volume" in stocks_df else 0
                ),
            },
            # Top Bullish Stocks (based on multiple indicators)
            "top_bullish": StockDataFetcher._get_bullish_stocks(stocks_df),
            # Top Bearish Stocks
            "top_bearish": StockDataFetcher._get_bearish_stocks(stocks_df),
            # Best for Short Term (1 week)
            "best_short_term": StockDataFetcher._get_short_term_picks(stocks_df),
            # Best for Medium Term (1 month)
            "best_medium_term": StockDataFetcher._get_medium_term_picks(stocks_df),
            # Best for Long Term (1 year)
            "best_long_term": StockDataFetcher._get_long_term_picks(stocks_df),
            # Overpriced Stocks
            "overpriced": StockDataFetcher._get_overpriced_stocks(stocks_df),
            # Underpriced Stocks
            "underpriced": StockDataFetcher._get_underpriced_stocks(stocks_df),
            # Volume Leaders
            "volume_leaders": StockDataFetcher._get_volume_leaders(stocks_df),
            # Momentum Stocks
            "momentum_stocks": StockDataFetcher._get_momentum_stocks(stocks_df),
            # Dividend Stocks
            "dividend_stocks": StockDataFetcher._get_dividend_stocks(stocks_df),
            # Growth Stocks
            "growth_stocks": StockDataFetcher._get_growth_stocks(stocks_df),
            # Top Positive Movers
            "top_positive_movers": StockDataFetcher._get_top_positive_movers(stocks_df),
            # Top Negative Movers
            "top_negative_movers": StockDataFetcher._get_top_negative_movers(stocks_df),
            # Top Sectors Change
            "top_sectors_change": StockDataFetcher._get_top_sectors_change(stocks_df),
        }

        return insights

    @staticmethod
    def _prepare_stocks_data(df):
        """Prepare all stocks data for frontend with proper field mapping"""
        stocks_list = []
        for _, row in df.iterrows():  # Limit to 200 stocks for performance
            stock_data = {
                'symbol': str(row.get('Symbol', '')),
                'name': str(row.get('Name', '')),
                'price': float(row.get('Price', 0)) if not pd.isna(row.get('Price', 0)) else 0,
                'change_percent': float(row.get('Change %', 0)) if not pd.isna(row.get('Change %', 0)) else 0,
                'volume': int(row.get('Volume', 0)) if not pd.isna(row.get('Volume', 0)) else 0,
                'market_capitalization': float(row.get('Market Capitalization', 0)) if not pd.isna(row.get('Market Capitalization', 0)) else 0,
                'price_to_earnings_ratio_ttm': float(row.get('Price to Earnings Ratio (TTM)', 0)) if not pd.isna(row.get('Price to Earnings Ratio (TTM)', 0)) else 0,
                'technical_rating': float(row.get('Technical Rating', 0)) if not pd.isna(row.get('Technical Rating', 0)) else 0,
                'weekly_performance': float(row.get('Performance (Week)', 0)) if not pd.isna(row.get('Performance (Week)', 0)) else 0,
                'monthly_performance': float(row.get('Performance (Month)', 0)) if not pd.isna(row.get('Performance (Month)', 0)) else 0,
                'yearly_performance': float(row.get('Performance (Year)', 0)) if not pd.isna(row.get('Performance (Year)', 0)) else 0,
                'dividend_yield_forward': float(row.get('Dividend Yield Forward', 0)) if not pd.isna(row.get('Dividend Yield Forward', 0)) else 0,
                'sector': str(row.get('Sector', '')),
                'industry': str(row.get('Industry', '')),
                'country': str(row.get('Country', 'Egypt')),
                'currency': str(row.get('Currency', 'EGP')),
                'exchange': str(row.get('Exchange', 'EGX')),
            }
            stocks_list.append(stock_data)
        return stocks_list

    @staticmethod
    def _prepare_comprehensive_stock_data(df, symbol):
        """Prepare comprehensive stock data for a specific symbol with all available attributes"""
        # Find the specific stock by symbol
        stock_row = df[df['Symbol'] == symbol]
        if stock_row.empty:
            return None
        
        row = stock_row.iloc[0]
        
        def safe_float(value, default=0):
            """Safely convert to float, handling NaN and inf values"""
            if pd.isna(value) or np.isinf(value):
                return default
            return float(value)
        
        def safe_int(value, default=0):
            """Safely convert to int, handling NaN and inf values"""
            if pd.isna(value) or np.isinf(value):
                return default
            return int(value)
        
        def safe_str(value, default=''):
            """Safely convert to string"""
            if pd.isna(value):
                return default
            return str(value)
        
        # Comprehensive stock data mapping
        stock_data = {
            # Basic Information
            'symbol': safe_str(row.get('Symbol', '')),
            'name': safe_str(row.get('Name', '')),
            'description': safe_str(row.get('Description', '')),
            'country': safe_str(row.get('Country', 'Egypt')),
            'currency': safe_str(row.get('Currency', 'EGP')),
            'exchange': safe_str(row.get('Exchange', 'EGX')),
            'industry': safe_str(row.get('Industry', '')),
            'sector': safe_str(row.get('Sector', '')),
            'submarket': safe_str(row.get('Submarket', '')),
            'subtype': safe_str(row.get('Subtype', '')),
            'type_field': safe_str(row.get('Type', '')),
            'logoid': safe_str(row.get('LogoID', '')),
            
            # Price Information
            'price': safe_float(row.get('Price', 0)),
            'open_price': safe_float(row.get('Open', 0)),
            'high': safe_float(row.get('High', 0)),
            'low': safe_float(row.get('Low', 0)),
            'close_price': safe_float(row.get('Close', 0)),
            'change': safe_float(row.get('Change', 0)),
            'change_percent': safe_float(row.get('Change %', 0)),
            'change_from_open': safe_float(row.get('Change from Open', 0)),
            'change_from_open_percent': safe_float(row.get('Change from Open %', 0)),
            'gap_percent': safe_float(row.get('Gap %', 0)),
            
            # Volume Information
            'volume': safe_int(row.get('Volume', 0)),
            'volume_price': safe_float(row.get('Volume Price', 0)),
            'volume_weighted_average_price': safe_float(row.get('Volume Weighted Average Price', 0)),
            'relative_volume': safe_float(row.get('Relative Volume', 0)),
            'relative_volume_at_time': safe_float(row.get('Relative Volume at Time', 0)),
            
            # Performance Metrics
            'weekly_performance': safe_float(row.get('Performance (Week)', 0)),
            'monthly_performance': safe_float(row.get('Performance (Month)', 0)),
            'yearly_performance': safe_float(row.get('Performance (Year)', 0)),
            'ytd_performance': safe_float(row.get('Performance (YTD)', 0)),
            'five_year_performance': safe_float(row.get('Performance (5Y)', 0)),
            'all_time_performance': safe_float(row.get('Performance (All)', 0)),
            'three_month_performance': safe_float(row.get('Performance (3M)', 0)),
            'six_month_performance': safe_float(row.get('Performance (6M)', 0)),
            
            # High/Low Records
            'all_time_high': safe_float(row.get('All Time High', 0)),
            'all_time_low': safe_float(row.get('All Time Low', 0)),
            'fifty_two_week_high': safe_float(row.get('52W High', 0)),
            'fifty_two_week_low': safe_float(row.get('52W Low', 0)),
            'one_month_high': safe_float(row.get('1M High', 0)),
            'one_month_low': safe_float(row.get('1M Low', 0)),
            'three_month_high': safe_float(row.get('3M High', 0)),
            'three_month_low': safe_float(row.get('3M Low', 0)),
            'six_month_high': safe_float(row.get('6M High', 0)),
            'six_month_low': safe_float(row.get('6M Low', 0)),
            
            # Market Capitalization
            'market_capitalization': safe_float(row.get('Market Capitalization', 0)),
            'enterprise_value': safe_float(row.get('Enterprise Value', 0)),
            'shares_outstanding': safe_float(row.get('Shares Outstanding', 0)),
            'shares_float': safe_float(row.get('Shares Float', 0)),
            
            # Valuation Ratios
            'price_to_earnings_ratio_ttm': safe_float(row.get('Price to Earnings Ratio (TTM)', 0)),
            'price_to_book_fy': safe_float(row.get('Price to Book (FY)', 0)),
            'price_to_book_mrq': safe_float(row.get('Price to Book (MRQ)', 0)),
            'price_to_sales_fy': safe_float(row.get('Price to Sales (FY)', 0)),
            'price_to_revenue_ratio_ttm': safe_float(row.get('Price to Revenue Ratio (TTM)', 0)),
            'price_to_free_cash_flow_ttm': safe_float(row.get('Price to Free Cash Flow (TTM)', 0)),
            'enterprise_value_ebitda_ttm': safe_float(row.get('Enterprise Value EBITDA (TTM)', 0)),
            
            # Financial Metrics
            'basic_eps_fy': safe_float(row.get('Basic EPS (FY)', 0)),
            'basic_eps_ttm': safe_float(row.get('Basic EPS (TTM)', 0)),
            'eps_diluted_fy': safe_float(row.get('EPS Diluted (FY)', 0)),
            'eps_diluted_mrq': safe_float(row.get('EPS Diluted (MRQ)', 0)),
            'eps_diluted_ttm': safe_float(row.get('EPS Diluted (TTM)', 0)),
            'eps_forecast_mrq': safe_float(row.get('EPS Forecast (MRQ)', 0)),
            
            # Growth Metrics
            'revenue_annual_yoy_growth': safe_float(row.get('Revenue (Annual YoY Growth)', 0)),
            'revenue_quarterly_qoq_growth': safe_float(row.get('Revenue (Quarterly QoQ Growth)', 0)),
            'revenue_quarterly_yoy_growth': safe_float(row.get('Revenue (Quarterly YoY Growth)', 0)),
            'revenue_ttm_yoy_growth': safe_float(row.get('Revenue (TTM YoY Growth)', 0)),
            'eps_diluted_annual_yoy_growth': safe_float(row.get('EPS Diluted (Annual YoY Growth)', 0)),
            'eps_diluted_quarterly_qoq_growth': safe_float(row.get('EPS Diluted (Quarterly QoQ Growth)', 0)),
            'eps_diluted_quarterly_yoy_growth': safe_float(row.get('EPS Diluted (Quarterly YoY Growth)', 0)),
            'eps_diluted_ttm_yoy_growth': safe_float(row.get('EPS Diluted (TTM YoY Growth)', 0)),
            'ebitda_annual_yoy_growth': safe_float(row.get('EBITDA (Annual YoY Growth)', 0)),
            'ebitda_quarterly_qoq_growth': safe_float(row.get('EBITDA (Quarterly QoQ Growth)', 0)),
            'ebitda_quarterly_yoy_growth': safe_float(row.get('EBITDA (Quarterly YoY Growth)', 0)),
            'ebitda_ttm_yoy_growth': safe_float(row.get('EBITDA (TTM YoY Growth)', 0)),
            
            # Profitability Metrics
            'gross_margin_fy': safe_float(row.get('Gross Margin (FY)', 0)),
            'gross_margin_ttm': safe_float(row.get('Gross Margin (TTM)', 0)),
            'operating_margin_fy': safe_float(row.get('Operating Margin (FY)', 0)),
            'operating_margin_ttm': safe_float(row.get('Operating Margin (TTM)', 0)),
            'net_margin_fy': safe_float(row.get('Net Margin (FY)', 0)),
            'net_margin_ttm': safe_float(row.get('Net Margin (TTM)', 0)),
            'pretax_margin_ttm': safe_float(row.get('Pretax Margin (TTM)', 0)),
            'free_cash_flow_margin_fy': safe_float(row.get('Free Cash Flow Margin (FY)', 0)),
            'free_cash_flow_margin_ttm': safe_float(row.get('Free Cash Flow Margin (TTM)', 0)),
            
            # Return Metrics
            'return_on_assets_ttm': safe_float(row.get('Return on Assets (TTM)', 0)),
            'return_on_equity_ttm': safe_float(row.get('Return on Equity (TTM)', 0)),
            'return_on_invested_capital_ttm': safe_float(row.get('Return on Invested Capital (TTM)', 0)),
            
            # Debt Metrics
            'debt_to_equity_ratio_mrq': safe_float(row.get('Debt to Equity Ratio (MRQ)', 0)),
            'current_ratio_mrq': safe_float(row.get('Current Ratio (MRQ)', 0)),
            'quick_ratio_mrq': safe_float(row.get('Quick Ratio (MRQ)', 0)),
            
            # Dividend Information
            'dividend_yield_forward': safe_float(row.get('Dividend Yield Forward', 0)),
            'dividends_per_share_fy': safe_float(row.get('Dividends per Share (FY)', 0)),
            'dividends_per_share_mrq': safe_float(row.get('Dividends per Share (MRQ)', 0)),
            'dividends_per_share_annual_yoy_growth': safe_float(row.get('Dividends per Share (Annual YoY Growth)', 0)),
            'dividends_paid_fy': safe_float(row.get('Dividends Paid (FY)', 0)),
            
            # Technical Indicators
            'relative_strength_index_14': safe_float(row.get('Relative Strength Index (14)', 0)),
            'relative_strength_index_7': safe_float(row.get('Relative Strength Index (7)', 0)),
            'macd_level_12_26': safe_float(row.get('MACD Level (12, 26)', 0)),
            'macd_signal_12_26': safe_float(row.get('MACD Signal (12, 26)', 0)),
            'stochastic_k_14_3_3': safe_float(row.get('Stochastic %K (14, 3, 3)', 0)),
            'stochastic_d_14_3_3': safe_float(row.get('Stochastic %D (14, 3, 3)', 0)),
            'stochastic_rsi_fast_3_3_14_14': safe_float(row.get('Stochastic RSI Fast (3, 3, 14, 14)', 0)),
            'stochastic_rsi_slow_3_3_14_14': safe_float(row.get('Stochastic RSI Slow (3, 3, 14, 14)', 0)),
            'williams_percent_range_14': safe_float(row.get('Williams Percent Range (14)', 0)),
            'average_directional_index_14': safe_float(row.get('Average Directional Index (14)', 0)),
            'positive_directional_indicator_14': safe_float(row.get('Positive Directional Indicator (14)', 0)),
            'negative_directional_indicator_14': safe_float(row.get('Negative Directional Indicator (14)', 0)),
            'commodity_channel_index_20': safe_float(row.get('Commodity Channel Index (20)', 0)),
            'ultimate_oscillator_7_14_28': safe_float(row.get('Ultimate Oscillator (7, 14, 28)', 0)),
            'awesome_oscillator': safe_float(row.get('Awesome Oscillator', 0)),
            'momentum_10': safe_float(row.get('Momentum (10)', 0)),
            'rate_of_change_9': safe_float(row.get('Rate of Change (9)', 0)),
            'bull_bear_power': safe_float(row.get('Bull Bear Power', 0)),
            
            # Moving Averages
            'simple_moving_average_5': safe_float(row.get('Simple Moving Average (5)', 0)),
            'simple_moving_average_10': safe_float(row.get('Simple Moving Average (10)', 0)),
            'simple_moving_average_20': safe_float(row.get('Simple Moving Average (20)', 0)),
            'simple_moving_average_30': safe_float(row.get('Simple Moving Average (30)', 0)),
            'simple_moving_average_50': safe_float(row.get('Simple Moving Average (50)', 0)),
            'simple_moving_average_100': safe_float(row.get('Simple Moving Average (100)', 0)),
            'simple_moving_average_200': safe_float(row.get('Simple Moving Average (200)', 0)),
            'exponential_moving_average_5': safe_float(row.get('Exponential Moving Average (5)', 0)),
            'exponential_moving_average_10': safe_float(row.get('Exponential Moving Average (10)', 0)),
            'exponential_moving_average_20': safe_float(row.get('Exponential Moving Average (20)', 0)),
            'exponential_moving_average_30': safe_float(row.get('Exponential Moving Average (30)', 0)),
            'exponential_moving_average_50': safe_float(row.get('Exponential Moving Average (50)', 0)),
            'exponential_moving_average_100': safe_float(row.get('Exponential Moving Average (100)', 0)),
            'exponential_moving_average_200': safe_float(row.get('Exponential Moving Average (200)', 0)),
            'hull_moving_average_9': safe_float(row.get('Hull Moving Average (9)', 0)),
            'volume_weighted_moving_average_20': safe_float(row.get('Volume Weighted Moving Average (20)', 0)),
            
            # Bollinger Bands
            'bollinger_upper_band_20': safe_float(row.get('Bollinger Upper Band (20)', 0)),
            'bollinger_lower_band_20': safe_float(row.get('Bollinger Lower Band (20)', 0)),
            
            # Ichimoku Cloud
            'ichimoku_conversion_line_9_26_52_26': safe_float(row.get('Ichimoku Conversion Line (9, 26, 52, 26)', 0)),
            'ichimoku_base_line_9_26_52_26': safe_float(row.get('Ichimoku Base Line (9, 26, 52, 26)', 0)),
            'ichimoku_leading_span_a_9_26_52_26': safe_float(row.get('Ichimoku Leading Span A (9, 26, 52, 26)', 0)),
            'ichimoku_leading_span_b_9_26_52_26': safe_float(row.get('Ichimoku Leading Span B (9, 26, 52, 26)', 0)),
            
            # Other Technical Indicators
            'parabolic_sar': safe_float(row.get('Parabolic SAR', 0)),
            'average_true_range_14': safe_float(row.get('Average True Range (14)', 0)),
            'average_day_range_14': safe_float(row.get('Average Day Range (14)', 0)),
            'volatility': safe_float(row.get('Volatility', 0)),
            'volatility_week': safe_float(row.get('Volatility Week', 0)),
            'volatility_month': safe_float(row.get('Volatility Month', 0)),
            'aroon_up_14': safe_float(row.get('Aroon Up (14)', 0)),
            'aroon_down_14': safe_float(row.get('Aroon Down (14)', 0)),
            'money_flow_14': safe_float(row.get('Money Flow (14)', 0)),
            'chaikin_money_flow_20': safe_float(row.get('Chaikin Money Flow (20)', 0)),
            
            # Ratings
            'technical_rating': safe_float(row.get('Technical Rating', 0)),
            'oscillators_rating': safe_float(row.get('Oscillators Rating', 0)),
            'moving_averages_rating': safe_float(row.get('Moving Averages Rating', 0)),
            
            # Beta
            'one_year_beta': safe_float(row.get('1 Year Beta', 0)),
        }
        
        return stock_data

    @staticmethod
    def _get_bullish_stocks(df, limit=10):
        """Identify bullish stocks based on technical indicators"""
        bullish_df = df.copy()

        # Calculate bullish score
        bullish_score = 0
        if "Relative Strength Index (14)" in df.columns:
            bullish_score += (df["Relative Strength Index (14)"] > 50).astype(int)
        if "MACD Level (12, 26)" in df.columns and "MACD Signal (12, 26)" in df.columns:
            bullish_score += (
                df["MACD Level (12, 26)"] > df["MACD Signal (12, 26)"]
            ).astype(int)
        if "Change %" in df.columns:
            bullish_score += (df["Change %"] > 0).astype(int)
        if "Technical Rating" in df.columns:
            bullish_score += (df["Technical Rating"] > 0).astype(int)

        bullish_df["bullish_score"] = bullish_score
        top_bullish = bullish_df.nlargest(limit, "bullish_score")

        return StockDataFetcher._format_stock_list(
            top_bullish, ["Symbol", "Name", "Price", "Change %", "Technical Rating"]
        )

    @staticmethod
    def _get_bearish_stocks(df, limit=10):
        """Identify bearish stocks"""
        bearish_df = df.copy()

        # Calculate bearish score
        bearish_score = 0
        if "Relative Strength Index (14)" in df.columns:
            bearish_score += (df["Relative Strength Index (14)"] < 50).astype(int)
        if "MACD Level (12, 26)" in df.columns and "MACD Signal (12, 26)" in df.columns:
            bearish_score += (
                df["MACD Level (12, 26)"] < df["MACD Signal (12, 26)"]
            ).astype(int)
        if "Change %" in df.columns:
            bearish_score += (df["Change %"] < 0).astype(int)
        if "Technical Rating" in df.columns:
            bearish_score += (df["Technical Rating"] < 0).astype(int)

        bearish_df["bearish_score"] = bearish_score
        top_bearish = bearish_df.nlargest(limit, "bearish_score")

        return StockDataFetcher._format_stock_list(
            top_bearish, ["Symbol", "Name", "Price", "Change %", "Technical Rating"]
        )

    @staticmethod
    def _get_short_term_picks(df, limit=10):
        """Best stocks for short term (1 week)"""
        if (
            "Weekly Performance" in df.columns
            and "Relative Strength Index (7)" in df.columns
        ):
            short_term = df.nlargest(limit, "Weekly Performance")
            return StockDataFetcher._format_stock_list(
                short_term,
                [
                    "Symbol",
                    "Name",
                    "Price",
                    "Weekly Performance",
                    "Relative Strength Index (7)",
                ],
            )
        return []

    @staticmethod
    def _get_medium_term_picks(df, limit=10):
        """Best stocks for medium term (1 month)"""
        if "Monthly Performance" in df.columns:
            medium_term = df.nlargest(limit, "Monthly Performance")
            return StockDataFetcher._format_stock_list(
                medium_term,
                ["Symbol", "Name", "Price", "Monthly Performance", "Change 1M, %"],
            )
        return []

    @staticmethod
    def _get_long_term_picks(df, limit=10):
        """Best stocks for long term (1 year)"""
        long_term_df = df.copy()

        # Calculate long term score based on fundamentals
        long_score = 0
        if "Return on Equity (TTM)" in df.columns:
            long_score += (df["Return on Equity (TTM)"] > 15).astype(int)
        if "EPS Diluted (TTM YoY Growth)" in df.columns:
            long_score += (df["EPS Diluted (TTM YoY Growth)"] > 0).astype(int)
        if "Revenue (TTM YoY Growth)" in df.columns:
            long_score += (df["Revenue (TTM YoY Growth)"] > 0).astype(int)
        if "Yearly Performance" in df.columns:
            long_score += (df["Yearly Performance"] > 0).astype(int)

        long_term_df["long_score"] = long_score
        top_long = long_term_df.nlargest(limit, "long_score")

        return StockDataFetcher._format_stock_list(
            top_long,
            ["Symbol", "Name", "Price", "Yearly Performance", "Return on Equity (TTM)"],
        )

    @staticmethod
    def _get_overpriced_stocks(df, limit=10):
        """Identify overpriced stocks based on valuation metrics"""
        if "Price to Earnings Ratio (TTM)" in df.columns:
            # Filter out negative and extremely high P/E ratios
            filtered_df = df[
                (df["Price to Earnings Ratio (TTM)"] > 0)
                & (df["Price to Earnings Ratio (TTM)"] < 1000)
            ]
            overpriced = filtered_df.nlargest(limit, "Price to Earnings Ratio (TTM)")
            return StockDataFetcher._format_stock_list(
                overpriced,
                [
                    "Symbol",
                    "Name",
                    "Price",
                    "Price to Earnings Ratio (TTM)",
                    "Price to Book (MRQ)",
                ],
            )
        return []

    @staticmethod
    def _get_underpriced_stocks(df, limit=10):
        """Identify underpriced stocks"""
        if (
            "Price to Earnings Ratio (TTM)" in df.columns
            and "Price to Book (MRQ)" in df.columns
        ):
            # Filter for positive P/E and P/B less than 3
            filtered_df = df[
                (df["Price to Earnings Ratio (TTM)"] > 0)
                & (df["Price to Earnings Ratio (TTM)"] < 15)
                & (df["Price to Book (MRQ)"] > 0)
                & (df["Price to Book (MRQ)"] < 3)
            ]
            underpriced = filtered_df.nsmallest(limit, "Price to Earnings Ratio (TTM)")
            return StockDataFetcher._format_stock_list(
                underpriced,
                [
                    "Symbol",
                    "Name",
                    "Price",
                    "Price to Earnings Ratio (TTM)",
                    "Price to Book (MRQ)",
                ],
            )
        return []

    @staticmethod
    def _get_volume_leaders(df, limit=10):
        """Get stocks with highest trading volume"""
        if "Volume" in df.columns:
            volume_leaders = df.nlargest(limit, "Volume")
            return StockDataFetcher._format_stock_list(
                volume_leaders, ["Symbol", "Name", "Price", "Volume", "Relative Volume"]
            )
        return []

    @staticmethod
    def _get_momentum_stocks(df, limit=10):
        """Get stocks with strong momentum"""
        if "Momentum (10)" in df.columns:
            momentum = df.nlargest(limit, "Momentum (10)")
            return StockDataFetcher._format_stock_list(
                momentum, ["Symbol", "Name", "Price", "Momentum (10)", "Change %"]
            )
        return []

    @staticmethod
    def _get_dividend_stocks(df, limit=10):
        """Get stocks with best dividend yields"""
        if "Dividend Yield Forward" in df.columns:
            dividend_df = df[df["Dividend Yield Forward"] > 0]
            dividend_stocks = dividend_df.nlargest(limit, "Dividend Yield Forward")
            return StockDataFetcher._format_stock_list(
                dividend_stocks,
                [
                    "Symbol",
                    "Name",
                    "Price",
                    "Dividend Yield Forward",
                    "Dividends per Share (FY)",
                ],
            )
        return []

    @staticmethod
    def _get_growth_stocks(df, limit=10):
        """Get stocks with highest growth potential"""
        growth_df = df.copy()

        # Calculate growth score
        growth_score = 0
        if "Revenue (TTM YoY Growth)" in df.columns:
            growth_score += (df["Revenue (TTM YoY Growth)"] > 10).astype(int)
        if "EPS Diluted (TTM YoY Growth)" in df.columns:
            growth_score += (df["EPS Diluted (TTM YoY Growth)"] > 10).astype(int)
        if "EBITDA (TTM YoY Growth)" in df.columns:
            growth_score += (df["EBITDA (TTM YoY Growth)"] > 10).astype(int)

        growth_df["growth_score"] = growth_score
        top_growth = growth_df.nlargest(limit, "growth_score")

        return StockDataFetcher._format_stock_list(
            top_growth,
            [
                "Symbol",
                "Name",
                "Price",
                "Revenue (TTM YoY Growth)",
                "EPS Diluted (TTM YoY Growth)",
            ],
        )

    @staticmethod
    def _get_top_positive_movers(df, limit=10):
        """Get stocks with highest positive change (daily top gainers)"""
        if "Change %" in df.columns:
            positive_change = df[df["Change %"] > 0].nlargest(limit, "Change %")
            return StockDataFetcher._format_stock_list(
                positive_change, ["Symbol", "Name", "Price", "Change %"]
            )
        return []

    @staticmethod
    def _get_top_negative_movers(df, limit=10):
        """Get stocks with highest negative change (daily top losers)"""
        if "Change %" in df.columns:
            negative_change = df[df["Change %"] < 0].nsmallest(limit, "Change %")  # most negative = largest fall
            return StockDataFetcher._format_stock_list(
                negative_change, ["Symbol", "Name", "Price", "Change %"]
            )
        return []

    @staticmethod
    def _get_top_sectors_change(df, limit=10):
        """Get top sectors by average change percentage"""
        if "Sector" not in df.columns or "Change %" not in df.columns:
            return []

        # Group by sector and calculate average change
        sector_performance = df.groupby('Sector')['Change %'].mean().reset_index()
        sector_performance = sector_performance.sort_values('Change %', ascending=False).head(limit)

        sectors = []
        for _, row in sector_performance.iterrows():
            sectors.append({
                'sector': str(row['Sector']),
                'change': float(row['Change %']) if not pd.isna(row['Change %']) else 0.0
            })

        return sectors

    @staticmethod
    def _format_stock_list(df, columns):
        """Format stock data for API response"""
        stocks = []
        available_cols = [col for col in columns if col in df.columns]

        for _, row in df.iterrows():
            stock_data = {}
            for col in available_cols:
                val = row[col]
                if pd.isna(val):
                    stock_data[col] = None
                elif isinstance(val, (np.integer, np.floating)):
                    stock_data[col] = float(val) if not np.isnan(val) else None
                else:
                    stock_data[col] = str(val)
            stocks.append(stock_data)

        return stocks
