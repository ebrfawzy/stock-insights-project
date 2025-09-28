"""
Stock API Views
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from datetime import datetime
from .stock_fetcher import StockDataFetcher
import json


class StockInsightsAPIView(APIView):
    """
    API endpoint to fetch Egyptian stock market insights
    """

    def get(self, request):
        """
        GET endpoint to fetch stock insights
        Caches data for 5 minutes to avoid excessive API calls
        """
        try:
            # Try to get cached data first
            cache_key = "egypt_stock_insights"
            cached_data = cache.get(cache_key)

            if cached_data:
                return Response(
                    {"success": True, "cached": True, "data": cached_data},
                    status=status.HTTP_200_OK,
                )

            # Fetch fresh data
            stocks_df = StockDataFetcher.fetch_egypt_stocks()

            if stocks_df.empty:
                return Response(
                    {
                        "success": False,
                        "message": "Unable to fetch stock data at this time",
                    },
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )

            # Process insights
            insights = StockDataFetcher.process_stock_insights(stocks_df)

            # Cache for 5 minutes
            cache.set(cache_key, insights, 300)

            return Response(
                {"success": True, "cached": False, "data": insights},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"success": False, "message": f"Error processing request: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class StockListAPIView(APIView):
    """
    API endpoint to list all stocks from external data source
    """
    
    def get(self, request):
        """
        GET endpoint to fetch all stocks from StockDataFetcher
        Caches data for 5 minutes to avoid excessive API calls
        """
        try:
            # Try to get cached data first
            cache_key = "egypt_stocks_list"
            cached_data = cache.get(cache_key)

            if cached_data:
                return Response(
                    {"success": True, "cached": True, "data": cached_data},
                    status=status.HTTP_200_OK,
                )

            # Fetch fresh data
            stocks_df = StockDataFetcher.fetch_egypt_stocks()

            if stocks_df.empty:
                return Response(
                    {
                        "success": False,
                        "message": "Unable to fetch stock data at this time",
                    },
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )

            # Process stocks data
            stocks_data = StockDataFetcher._prepare_stocks_data(stocks_df)
            
            # Apply filters if provided
            filtered_data = self._apply_filters(stocks_data, request.query_params)

            # Cache for 5 minutes
            cache.set(cache_key, filtered_data, 300)

            return Response(
                {
                    "success": True, 
                    "cached": False, 
                    "data": filtered_data,
                    "count": len(filtered_data)
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"success": False, "message": f"Error processing request: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    
    def _apply_filters(self, stocks_data, query_params):
        """
        Apply filters to the stocks data
        """
        filtered_data = stocks_data.copy()
        
        # Filter by sector if provided
        sector = query_params.get('sector', None)
        if sector:
            filtered_data = [
                stock for stock in filtered_data 
                if stock.get('Sector', '').lower().find(sector.lower()) != -1
            ]
        
        # Filter by industry if provided
        industry = query_params.get('industry', None)
        if industry:
            filtered_data = [
                stock for stock in filtered_data 
                if stock.get('Industry', '').lower().find(industry.lower()) != -1
            ]
        
        # Filter by market cap range
        min_market_cap = query_params.get('min_market_cap', None)
        max_market_cap = query_params.get('max_market_cap', None)
        
        if min_market_cap:
            min_cap = float(min_market_cap)
            filtered_data = [
                stock for stock in filtered_data 
                if stock.get('Market Capitalization', 0) and stock.get('Market Capitalization', 0) >= min_cap
            ]
        
        if max_market_cap:
            max_cap = float(max_market_cap)
            filtered_data = [
                stock for stock in filtered_data 
                if stock.get('Market Capitalization', 0) and stock.get('Market Capitalization', 0) <= max_cap
            ]
        
        # Search by symbol or name
        search = query_params.get('search', None)
        if search:
            search_lower = search.lower()
            filtered_data = [
                stock for stock in filtered_data 
                if (stock.get('Symbol', '').lower().find(search_lower) != -1 or
                    stock.get('Name', '').lower().find(search_lower) != -1)
            ]
        
        # Sort by market capitalization (descending)
        filtered_data.sort(
            key=lambda x: x.get('Market Capitalization', 0), 
            reverse=True
        )
        
        return filtered_data


class StockDetailAPIView(APIView):
    """
    API endpoint to get detailed information about a specific stock
    """
    
    def get(self, request, symbol):
        """
        GET endpoint to fetch detailed stock information by symbol
        """
        try:
            # Always fetch comprehensive data for individual stock details
            stocks_df = StockDataFetcher.fetch_egypt_stocks()
            if stocks_df.empty:
                return Response(
                    {
                        "success": False,
                        "message": "Unable to fetch stock data at this time",
                    },
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )
            
            # Get comprehensive stock data
            stock_data = StockDataFetcher._prepare_comprehensive_stock_data(stocks_df, symbol.upper())
            
            if not stock_data:
                return Response(
                    {'success': False, 'message': f'Stock with symbol {symbol} not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            return Response({
                'success': True,
                'data': stock_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'success': False, 'message': f'Error processing request: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


