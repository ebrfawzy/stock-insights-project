# Mzaker (مذاكر) - Learning and Knowledge Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Django](https://img.shields.io/badge/Django-4.2.7-green.svg)](https://djangoproject.com/)
[![Angular](https://img.shields.io/badge/Angular-20.3.0-red.svg)](https://angular.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com/)
[![Apache Airflow](https://img.shields.io/badge/Airflow-2.7.1-red.svg)](https://airflow.apache.org/)
[![DuckDB](https://img.shields.io/badge/DuckDB-0.9.1-orange.svg)](https://duckdb.org/)

Mzaker (مذاكر) - A comprehensive full-stack web application for real-time Egyptian stock market data analysis, insights, and visualization. Built with modern technologies and designed for both development and production deployment.

## 🌟 Features

### 📊 **Stock Market Data**
- **Real-time Data Fetching**: Live Egyptian stock market data integration
- **Comprehensive Stock Information**: Price, volume, performance metrics, and market indicators
- **Historical Performance Tracking**: Weekly, monthly, yearly, and YTD performance analysis
- **Market Insights**: Advanced analytics and trend identification

### 📈 **Data Visualization**
- **Interactive Charts**: Beautiful, responsive charts using Chart.js and Lightweight Charts
- **Technical Indicators**: Moving averages, volume analysis, and price trends
- **Performance Dashboards**: Visual representation of market movements
- **Responsive Design**: Optimized for desktop and mobile devices

### 🔧 **Technical Excellence**
- **RESTful API**: Well-structured Django REST framework endpoints
- **Scalable Architecture**: Microservices-ready design
- **Production Optimized**: Gunicorn, WhiteNoise, and static file optimization

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular SPA   │◄──►│  Django REST    │◄──►│   PostgreSQL    │
│                 │    │     API         │    │   (OLTP DB)     │
│   Frontend      │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Bootstrap +   │    │   Static Files  │    │ Apache Airflow  │
│   Charts.js     │    │   (WhiteNoise)  │    │ Data Pipeline   │
└─────────────────┘    └─────────────────┘    └────────┬────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │     DuckDB      │
                                              │    (OLAP DB)    │
                                              └────────┬────────┘
                                                      │
                                              ┌────────▼────────┐
                                              │  S3/MinIO       │
                                              │  Data Lake      │
                                              └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Docker & Docker Compose** (recommended)
- **Node.js 18+** & **npm** (for frontend development)
- **Python 3.10+** (for backend development)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stock-insights-project.git
   cd stock-insights-project
   ```

2. **Set up environment variables**
   ```bash
   # For local development, use .env.local (already configured for local setup)
   # For production deployment, copy and edit .env.prod with your values
   cp .env.prod .env.prod.local
   # Edit .env.prod.local with your production values
   ```

3. **Start the application stack**

   For local development:
   ```bash
   # Start all services using local configuration
   docker-compose up

   # Or explicitly specify the environment file
   ENV_FILE=.env.local docker-compose up
   ```

   For production:
   ```bash
   # Start services using production configuration
   ENV_FILE=.env.prod docker-compose up
   ```

4. **Access the applications**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8000
   - Airflow UI: http://localhost:8080
   - MinIO Console: http://localhost:9001

### Production Deployment (Railway.app)

1. **Set up Railway project**
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   # Login to Railway
   railway login
   ```

2. **Configure environment variables**
   - Copy contents of `.env.prod.template` and configure in Railway dashboard
   - Copy contents of `airflow/.env.prod.template` and configure in Railway dashboard
   - Ensure AWS S3 credentials are properly configured

3. **Deploy the services**
   ```bash
   # Deploy backend
   cd backend && railway up
   # Deploy frontend
   cd frontend && railway up
   # Deploy Airflow
   cd airflow && railway up
   ```

### Data Pipeline Setup

The data pipeline consists of several components:

1. **Apache Airflow**: Orchestrates the data workflows
   - Located in the `airflow/` directory
   - DAGs are stored in `airflow/dags/`
   - Custom plugins in `airflow/plugins/`

2. **DuckDB**: Analytics database
   - Stores processed and aggregated data
   - Schema automatically initialized on first run
   - Located in `duckdb/` directory

3. **S3 Storage**:
   - Uses MinIO for local development
   - Real AWS S3 for production
   - Configured through environment variables

4. **Environment Configuration**:
   - Local: Uses MinIO as S3 alternative
   - Production: Uses AWS S3
   - Configuration via environment variables
- **Python 3.11+** (for backend development)
- **PostgreSQL 15+** (for production database)

### 🐳 **Docker Compose (Recommended)**

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd stock-insights-project
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - **Frontend**: http://localhost:4200
   - **Backend API**: http://localhost:8000
   - **Admin Panel**: http://localhost:8000/admin

### 🔧 **Manual Setup**

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📋 Tech Stack

### Backend
- **Framework**: Django 4.2.7
- **API**: Django REST Framework 3.14.0
- **Database**: PostgreSQL 15
- **Deployment**: Gunicorn 21.2.0
- **Static Files**: WhiteNoise 6.6.0

### Frontend
- **Framework**: Angular 20.3.0
- **Styling**: Bootstrap 5.3.8 + Bootstrap Icons 1.13.1
- **Charts**: Chart.js 4.5.0 + Lightweight Charts 4.1.3
- **HTTP Client**: Axios 1.12.2
- **Build Tool**: Angular CLI 20.3.3

### Development Tools
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15 Alpine
- **Code Quality**: Prettier, ESLint

## 🔧 Development

### Project Structure
```
stock-insights-project/
├── backend/                 # Django REST API
│   ├── stock_api/          # Project settings
│   ├── stocks/             # Main application
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API endpoints
│   │   ├── serializers.py  # Data serialization
│   │   └── stock_fetcher.py # Data fetching logic
│   └── requirements.txt
├── frontend/               # Angular SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Feature components
│   │   │   └── services/   # API services
│   │   └── environments/   # Environment configs
│   └── package.json
└── docker-compose.yml      # Development environment
```

### Key Features Implementation

#### Stock Data Management
- **Models**: Comprehensive stock information with 50+ fields
- **API Endpoints**: RESTful design with proper status codes
- **Caching Strategy**: 5-minute cache for external API calls
- **Error Handling**: Graceful degradation and user feedback

#### Data Visualization
- **Chart Components**: Reusable chart components with multiple chart types
- **Real-time Updates**: Efficient data polling and updates
- **Responsive Design**: Mobile-first approach with Bootstrap grid system

## 🚢 Deployment

### Production Deployment (Railway.app)

#### Backend Service
```bash
# Required Environment Variables
DJ_ENV=production
DJ_DEBUG=False
DJ_SECRET=your-super-secret-key
DATABASE_URL=${POSTGRES.DATABASE_URL}
FRONTEND_URL=https://your-frontend-domain.railway.app
```

#### Frontend Service
```bash
# Required Environment Variables
PORT=3000
API_URL=https://your-backend-domain.railway.app
```

### Docker Deployment
```bash
# Backend
docker build -t stock-api-backend ./backend
docker run -p 8000:8000 \
  -e DJ_ENV=production \
  -e DATABASE_URL=postgresql://... \
  stock-api-backend

# Frontend
docker build -t stock-api-frontend ./frontend
docker run -p 3000:3000 \
  -e PORT=3000 \
  stock-api-frontend
```

## 🔒 Security

### Backend Security
- **Environment-based Configuration**: No hardcoded secrets
- **CORS Protection**: Proper cross-origin resource sharing setup
- **Security Headers**: Django security middleware enabled
- **Non-root Container**: Security best practices in Docker

### Frontend Security
- **Content Security Policy**: XSS protection measures
- **Input Validation**: Client-side validation with server verification
- **HTTPS Enforcement**: Secure communication protocols

## 📊 API Reference

### Core Endpoints

#### Stock Insights
```http
GET /api/stocks/insights/
```
Fetches comprehensive stock market insights with caching.

**Response:**
```json
{
  "success": true,
  "cached": false,
  "data": {
    "stocks": [...],
    "market_summary": {...},
    "top_performers": [...]
  }
}
```

#### Stock Details
```http
GET /api/stocks/{symbol}/
```
Retrieves detailed information for a specific stock.

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📈 Performance

### Optimization Features
- **Database Indexing**: Optimized queries with proper indexes
- **Static File Optimization**: WhiteNoise for efficient static file serving
- **Production Builds**: Optimized Angular production bundles

### Monitoring
- **Error Tracking**: Comprehensive error logging and reporting
- **Performance Metrics**: Response time and throughput monitoring

## 🤝 Contributing

We welcome contributions!

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- **Backend**: PEP 8 compliance with Black formatting
- **Frontend**: ESLint + Prettier configuration
- **Commits**: Conventional commit messages

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TradingView** for financial data APIs
- **Egyptian Stock Exchange** for market data
- **Django Community** for excellent documentation and support
- **Angular Team** for the robust frontend framework

## 📞 Support

For support and questions:
- 📧 **Email**: support@stockinsights.com
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/stock-insights-project/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/stock-insights-project/issues)
- 📚 **Wiki**: [Project Wiki](https://github.com/your-username/stock-insights-project/wiki)

## 🗺️ Roadmap

- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **Advanced Analytics**: Machine learning-powered predictions
- [ ] **Portfolio Tracking**: Personal investment portfolio management
- [ ] **Real-time Notifications**: Price alerts and market updates
- [ ] **API Marketplace**: Third-party integrations and plugins
- [ ] **Multi-language Support**: Arabic and English interface

---

<div align="center">

**Built with ❤️ for the Egyptian stock market community**

[⭐ Star this repo](https://github.com/your-username/stock-insights-project) | [🐛 Report Bug](https://github.com/your-username/stock-insights-project/issues) | [💡 Request Feature](https://github.com/your-username/stock-insights-project/issues)

</div>
