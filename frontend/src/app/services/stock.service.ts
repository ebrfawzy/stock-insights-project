import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change_percent: number;
  volume: number;
  market_capitalization: number;
  price_to_earnings_ratio_ttm: number;
  price_to_book_mrq?: number;
  technical_rating: number;
  weekly_performance: number;
  monthly_performance: number;
  yearly_performance: number;
  dividend_yield_forward: number;
  dividends_per_share_fy?: number;
  relative_volume?: number;
  momentum_10?: number;
  relative_strength_index_7?: number;
  revenue_ttm_yoy_growth?: number;
  eps_diluted_ttm_yoy_growth?: number;
  return_on_equity_ttm?: number;
  change_1m_percent?: number;
  sector: string;
  industry: string;
  country: string;
  currency: string;
  exchange: string;
}

export interface StockDetail extends Stock {
  // Additional fields that might be available in detailed view
  description?: string;
  open_price?: number;
  high?: number;
  low?: number;
  close_price?: number;
  change?: number;
  change_from_open?: number;
  change_from_open_percent?: number;
  gap_percent?: number;
  volume_price?: number;
  volume_weighted_average_price?: number;
  relative_volume?: number;
  all_time_high?: number;
  all_time_low?: number;
  fifty_two_week_high?: number;
  fifty_two_week_low?: number;
  shares_outstanding?: number;
  shares_float?: number;
  enterprise_value?: number;
  price_to_book_fy?: number;
  price_to_book_mrq?: number;
  price_to_sales_fy?: number;
  price_to_revenue_ratio_ttm?: number;
  price_to_free_cash_flow_ttm?: number;
  enterprise_value_ebitda_ttm?: number;
  basic_eps_fy?: number;
  basic_eps_ttm?: number;
  eps_diluted_fy?: number;
  eps_diluted_mrq?: number;
  eps_diluted_ttm?: number;
  eps_forecast_mrq?: number;
  revenue_annual_yoy_growth?: number;
  revenue_quarterly_qoq_growth?: number;
  revenue_quarterly_yoy_growth?: number;
  revenue_ttm_yoy_growth?: number;
  eps_diluted_annual_yoy_growth?: number;
  eps_diluted_quarterly_qoq_growth?: number;
  eps_diluted_quarterly_yoy_growth?: number;
  eps_diluted_ttm_yoy_growth?: number;
  ebitda_annual_yoy_growth?: number;
  ebitda_quarterly_qoq_growth?: number;
  ebitda_quarterly_yoy_growth?: number;
  ebitda_ttm_yoy_growth?: number;
  gross_margin_fy?: number;
  gross_margin_ttm?: number;
  operating_margin_fy?: number;
  operating_margin_ttm?: number;
  net_margin_fy?: number;
  net_margin_ttm?: number;
  pretax_margin_ttm?: number;
  free_cash_flow_margin_fy?: number;
  free_cash_flow_margin_ttm?: number;
  return_on_assets_ttm?: number;
  return_on_equity_ttm?: number;
  return_on_invested_capital_ttm?: number;
  debt_to_equity_ratio_mrq?: number;
  current_ratio_mrq?: number;
  quick_ratio_mrq?: number;
  dividends_per_share_fy?: number;
  dividends_per_share_mrq?: number;
  dividends_per_share_annual_yoy_growth?: number;
  dividends_paid_fy?: number;
  relative_strength_index_14?: number;
  relative_strength_index_7?: number;
  macd_level_12_26?: number;
  macd_signal_12_26?: number;
  stochastic_k_14_3_3?: number;
  stochastic_d_14_3_3?: number;
  stochastic_rsi_fast_3_3_14_14?: number;
  stochastic_rsi_slow_3_3_14_14?: number;
  williams_percent_range_14?: number;
  average_directional_index_14?: number;
  positive_directional_indicator_14?: number;
  negative_directional_indicator_14?: number;
  commodity_channel_index_20?: number;
  ultimate_oscillator_7_14_28?: number;
  awesome_oscillator?: number;
  momentum_10?: number;
  rate_of_change_9?: number;
  bull_bear_power?: number;
  simple_moving_average_5?: number;
  simple_moving_average_10?: number;
  simple_moving_average_20?: number;
  simple_moving_average_30?: number;
  simple_moving_average_50?: number;
  simple_moving_average_100?: number;
  simple_moving_average_200?: number;
  exponential_moving_average_5?: number;
  exponential_moving_average_10?: number;
  exponential_moving_average_20?: number;
  exponential_moving_average_30?: number;
  exponential_moving_average_50?: number;
  exponential_moving_average_100?: number;
  exponential_moving_average_200?: number;
  hull_moving_average_9?: number;
  volume_weighted_moving_average_20?: number;
  bollinger_upper_band_20?: number;
  bollinger_lower_band_20?: number;
  ichimoku_conversion_line_9_26_52_26?: number;
  ichimoku_base_line_9_26_52_26?: number;
  ichimoku_leading_span_a_9_26_52_26?: number;
  ichimoku_leading_span_b_9_26_52_26?: number;
  parabolic_sar?: number;
  average_true_range_14?: number;
  average_day_range_14?: number;
  volatility?: number;
  volatility_week?: number;
  volatility_month?: number;
  aroon_up_14?: number;
  aroon_down_14?: number;
  money_flow_14?: number;
  chaikin_money_flow_20?: number;
  oscillators_rating?: number;
  moving_averages_rating?: number;
  one_year_beta?: number;
  ytd_performance?: number;
  five_year_performance?: number;
  all_time_performance?: number;
  three_month_performance?: number;
  six_month_performance?: number;
  one_month_high?: number;
  one_month_low?: number;
  three_month_high?: number;
  three_month_low?: number;
  six_month_high?: number;
  six_month_low?: number;
  relative_volume_at_time?: number;
  submarket?: string;
  subtype?: string;
  type_field?: string;
  logoid?: string;
  is_bullish?: boolean;
  is_undervalued?: boolean;
  is_growth_stock?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StockInsights {
  timestamp: string;
  total_stocks: number;
  market_overview: {
    total_market_cap: number;
    average_pe_ratio: number;
    average_volume: number;
  };
  top_bullish: Stock[];
  top_bearish: Stock[];
  best_short_term: Stock[];
  best_medium_term: Stock[];
  best_long_term: Stock[];
  overpriced: Stock[];
  underpriced: Stock[];
  volume_leaders: Stock[];
  momentum_stocks: Stock[];
  dividend_stocks: Stock[];
  growth_stocks: Stock[];
  top_positive_movers: Stock[];
  top_negative_movers: Stock[];
  top_sectors_change: any[]; // Define based on backend response
  all_stocks: Stock[];
}


@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = environment.apiUrl || 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Get comprehensive stock insights
  getStockInsights(): Observable<{success: boolean, cached?: boolean, data: StockInsights}> {
    return this.http.get<{success: boolean, cached?: boolean, data: StockInsights}>(`${this.apiUrl}/insights/`);
  }


  // Get all stocks with optional filters
  getStocks(params?: {
    sector?: string;
    industry?: string;
    min_market_cap?: number;
    max_market_cap?: number;
    search?: string;
  }): Observable<{success: boolean, cached?: boolean, data: Stock[], count: number}> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] !== undefined) {
          httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
        }
      });
    }

    return this.http.get<{success: boolean, cached?: boolean, data: Stock[], count: number}>(`${this.apiUrl}/stocks/`, { params: httpParams });
  }

  // Get individual stock details
  getStockDetail(symbol: string): Observable<{success: boolean, cached?: boolean, data: StockDetail}> {
    return this.http.get<{success: boolean, cached?: boolean, data: StockDetail}>(`${this.apiUrl}/stocks/${symbol}/`);
  }

}
