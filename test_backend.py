#!/usr/bin/env python3
"""
Simple test script to verify backend API endpoints
"""

import requests
import json

def test_api():
    base_url = "http://localhost:8000/api"
    
    print("Testing Backend API Endpoints...")
    print("=" * 50)
    
    # Test stocks endpoint
    print("\n1. Testing /stocks/ endpoint:")
    try:
        response = requests.get(f"{base_url}/stocks/")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"✅ Success: Received {len(data)} stocks")
                if len(data) > 0:
                    print(f"Sample stock: {data[0]}")
            else:
                print(f"❌ Unexpected response format: {type(data)}")
                print(f"Response: {data}")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    # Test insights endpoint
    print("\n2. Testing /insights/ endpoint:")
    try:
        response = requests.get(f"{base_url}/insights/")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: {data.get('success', False)}")
            if 'data' in data:
                insights = data['data']
                print(f"Total stocks: {insights.get('total_stocks', 0)}")
                print(f"Top bullish: {len(insights.get('top_bullish', []))}")
                print(f"Top bearish: {len(insights.get('top_bearish', []))}")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    # Test stock detail endpoint (if we have stocks)
    print("\n3. Testing stock detail endpoint:")
    try:
        response = requests.get(f"{base_url}/stocks/")
        if response.status_code == 200:
            stocks = response.json()
            if isinstance(stocks, list) and len(stocks) > 0:
                symbol = stocks[0].get('symbol')
                if symbol:
                    detail_response = requests.get(f"{base_url}/stocks/{symbol}/")
                    print(f"Status for {symbol}: {detail_response.status_code}")
                    if detail_response.status_code == 200:
                        print("✅ Stock detail endpoint working")
                    else:
                        print(f"❌ Stock detail error: {detail_response.text}")
                else:
                    print("❌ No symbol found in first stock")
            else:
                print("❌ No stocks available for detail test")
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    test_api()
