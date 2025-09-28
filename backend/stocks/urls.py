"""
URL configuration for stocks app.
"""

from django.urls import path
from . import views

urlpatterns = [
    # Main insights endpoint (includes all categorized data)
    path('insights/', views.StockInsightsAPIView.as_view(), name='stock-insights'),
    
    # Stock lists
    path('stocks/', views.StockListAPIView.as_view(), name='stock-list'),
    path('stocks/<str:symbol>/', views.StockDetailAPIView.as_view(), name='stock-detail'),
]
