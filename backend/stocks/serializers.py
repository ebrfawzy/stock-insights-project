from rest_framework import serializers
from .models import Stock


class StockSerializer(serializers.ModelSerializer):
    """Serializer for comprehensive stock data"""
    
    is_bullish = serializers.ReadOnlyField()
    is_undervalued = serializers.ReadOnlyField()
    is_growth_stock = serializers.ReadOnlyField()
    
    class Meta:
        model = Stock
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class StockListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for stock lists"""
    
    class Meta:
        model = Stock
        fields = [
            'id', 'symbol', 'name', 'price', 'change_percent', 'volume',
            'market_capitalization', 'price_to_earnings_ratio_ttm',
            'technical_rating', 'weekly_performance', 'monthly_performance',
            'yearly_performance', 'dividend_yield_forward', 'sector', 'industry'
        ]


class StockInsightsSerializer(serializers.Serializer):
    """Serializer for stock insights data"""
    
    timestamp = serializers.DateTimeField()
    total_stocks = serializers.IntegerField()
    market_overview = serializers.DictField()
    top_bullish = StockListSerializer(many=True)
    top_bearish = StockListSerializer(many=True)
    best_short_term = StockListSerializer(many=True)
    best_medium_term = StockListSerializer(many=True)
    best_long_term = StockListSerializer(many=True)
    overpriced = StockListSerializer(many=True)
    underpriced = StockListSerializer(many=True)
    volume_leaders = StockListSerializer(many=True)
    momentum_stocks = StockListSerializer(many=True)
    dividend_stocks = StockListSerializer(many=True)
    growth_stocks = StockListSerializer(many=True)

