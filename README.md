# StockInsights - Egyptian Stock Market Analysis Platform

A comprehensive Django + Angular application for analyzing Egyptian stock market data with real-time insights, technical analysis, and investment recommendations.

## 🚀 Features

### 📊 Market Insights
- **Top Bullish/Bearish Stocks**: AI-powered analysis to identify market trends
- **Investment Strategies**: Best stocks for short-term (1 week), medium-term (1 month), and long-term (1 year) investments
- **Value Analysis**: Overpriced and underpriced stock identification
- **Volume Leaders**: Most actively traded stocks
- **Dividend Stocks**: High-yield dividend opportunities
- **Growth Stocks**: Companies with strong growth potential

### 📈 Technical Analysis
- **50+ Technical Indicators**: RSI, MACD, Stochastic, Williams %R, Bollinger Bands, Ichimoku Cloud, and more
- **Moving Averages**: Simple and Exponential moving averages (5, 10, 20, 30, 50, 100, 200)
- **Momentum Indicators**: Rate of change, momentum, and trend analysis
- **Volume Analysis**: Volume-weighted indicators and money flow analysis

### 💰 Financial Metrics
- **Valuation Ratios**: P/E, P/B, P/S, EV/EBITDA ratios
- **Growth Metrics**: Revenue, EPS, and EBITDA growth analysis
- **Profitability**: Gross, operating, and net margins
- **Returns**: ROA, ROE, and ROIC calculations
- **Debt Analysis**: Debt-to-equity and liquidity ratios

### 🌍 Internationalization
- **Multi-language Support**: English (UK) and Arabic (Egypt)
- **RTL Support**: Right-to-left layout for Arabic
- **Dynamic Language Switching**: Real-time language changes

### 📱 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, professional design with smooth animations
- **Interactive Charts**: Lightweight-charts integration for data visualization
- **Real-time Updates**: Live market data with caching for performance

## 🏗️ Architecture

### Backend (Django)
- **Django REST Framework**: RESTful API endpoints
- **Comprehensive Models**: 200+ stock data fields
- **Caching**: Redis-based caching for performance
- **Data Processing**: Advanced stock analysis algorithms

### Frontend (Angular)
- **Angular 20**: Latest Angular framework
- **Standalone Components**: Modern Angular architecture
- **Services**: Centralized API communication
- **Routing**: Lazy-loaded routes for performance

## 📁 Project Structure

```
stock-insights-project/
├── backend/
│   ├── stock_api/           # Django project settings
│   ├── stocks/             # Main Django app
│   │   ├── models.py       # Comprehensive stock models
│   │   ├── views.py        # API endpoints
│   │   ├── serializers.py  # Data serialization
│   │   ├── stock_fetcher.py # Data fetching logic
│   │   └── urls.py         # URL routing
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── landing/        # Landing page
│   │   │   │   ├── insights/      # Market insights
│   │   │   │   ├── stocks/        # Stock list
│   │   │   │   └── stock-detail/  # Individual stock details
│   │   │   ├── services/
│   │   │   │   ├── stock.service.ts    # API communication
│   │   │   │   └── language.service.ts # i18n support
│   │   │   ├── app.routes.ts      # Routing configuration
│   │   │   └── app.ts            # Main app component
│   │   └── environments/
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- Django 5.2+
- Angular 20+

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r ../django-requirements.txt
   ```

4. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Start Django server**:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Angular development server**:
   ```bash
   npm start
   ```

## 🌐 API Endpoints

### Market Insights
- `GET /api/insights/` - Comprehensive market insights
- `GET /api/market-overview/` - Market statistics and overview

### Stock Data
- `GET /api/stocks/` - List all stocks with filtering
- `GET /api/stocks/{symbol}/` - Individual stock details

### Categorized Lists
- `GET /api/stocks/bullish/` - Top bullish stocks
- `GET /api/stocks/bearish/` - Top bearish stocks
- `GET /api/stocks/overpriced/` - Overpriced stocks
- `GET /api/stocks/underpriced/` - Underpriced stocks
- `GET /api/stocks/volume-leaders/` - Volume leaders
- `GET /api/stocks/dividend/` - Dividend stocks
- `GET /api/stocks/growth/` - Growth stocks

## 📊 Data Sources

The application uses the `tvscreener` library to fetch real-time Egyptian stock market data, including:

- **500+ Stocks**: Comprehensive coverage of Egyptian stock market
- **200+ Data Points**: Price, volume, technical indicators, financial metrics
- **Real-time Updates**: Live market data with 5-minute caching

## 🎨 UI Components

### Landing Page
- Hero section with animated charts
- Feature highlights
- Market statistics
- Call-to-action sections

### Insights Page
- Market overview dashboard
- Categorized stock rankings
- Performance metrics
- Interactive filtering

### Stock Details Page
- Comprehensive stock information
- Technical indicators analysis
- Financial metrics breakdown
- Performance charts

### Stock List Page
- Searchable and filterable table
- Pagination support
- Sorting capabilities
- Export functionality

## 🔧 Configuration

### Environment Variables
Create `.env` files for configuration:

**Backend (.env)**:
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
CACHE_URL=redis://localhost:6379/0
```

**Frontend (environment.ts)**:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

## 🚀 Deployment

### Backend Deployment
1. Set `DEBUG=False` in production
2. Configure production database
3. Set up Redis for caching
4. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build for production: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Update API URL in environment files

## 📈 Performance Features

- **Caching**: 5-minute cache for API responses
- **Lazy Loading**: Route-based code splitting
- **Pagination**: Efficient data loading
- **Optimized Queries**: Database query optimization
- **CDN Ready**: Static asset optimization

## 🔒 Security Features

- **CORS Configuration**: Proper cross-origin setup
- **Input Validation**: Server-side validation
- **SQL Injection Protection**: Django ORM protection
- **XSS Protection**: Angular sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: info@stockinsights.com

## 🔮 Future Enhancements

- **Real-time WebSocket Updates**: Live price updates
- **Portfolio Management**: Track personal investments
- **Advanced Charting**: More chart types and indicators
- **Mobile App**: React Native or Flutter app
- **AI Predictions**: Machine learning price predictions
- **Social Features**: Share insights and follow other investors

---

**Built with ❤️ for the Egyptian stock market community**

