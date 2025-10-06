# FuturePath AI - Database Schema

## 🗄️ Database Architecture

### Technology Stack
- **Primary Database**: PostgreSQL (ACID compliance, complex queries)
- **Cache Layer**: Redis (session management, real-time data)
- **Search Engine**: Elasticsearch (market data, news search)
- **Time Series**: InfluxDB (stock prices, real-time data)
- **Document Store**: MongoDB (user profiles, AI insights)

## 👤 User Management

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    pan_number VARCHAR(10) UNIQUE,
    aadhar_number VARCHAR(12) UNIQUE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    kyc_status VARCHAR(20) DEFAULT 'pending',
    risk_profile VARCHAR(20) DEFAULT 'moderate',
    investment_experience VARCHAR(20) DEFAULT 'beginner',
    annual_income DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP
);
```

### User Profiles Table
```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    profile_picture VARCHAR(255),
    bio TEXT,
    investment_goals TEXT[],
    risk_tolerance INTEGER CHECK (risk_tolerance BETWEEN 1 AND 10),
    investment_horizon VARCHAR(20),
    preferred_instruments TEXT[],
    notification_preferences JSONB,
    privacy_settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true
);
```

## 💰 Financial Accounts

### Bank Accounts Table
```sql
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(50) NOT NULL,
    ifsc_code VARCHAR(11) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    account_holder_name VARCHAR(200) NOT NULL,
    account_type VARCHAR(20) DEFAULT 'savings',
    is_primary BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Trading Accounts Table
```sql
CREATE TABLE trading_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    broker_code VARCHAR(20),
    account_type VARCHAR(20) DEFAULT 'equity',
    status VARCHAR(20) DEFAULT 'active',
    margin_available DECIMAL(15,2) DEFAULT 0,
    margin_used DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Wallets Table
```sql
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_type VARCHAR(20) NOT NULL, -- 'equity', 'commodity', 'crypto'
    balance DECIMAL(15,2) DEFAULT 0,
    locked_amount DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'INR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📈 Market Data

### Stocks Table
```sql
CREATE TABLE stocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    exchange VARCHAR(10) NOT NULL, -- 'NSE', 'BSE'
    sector VARCHAR(100),
    industry VARCHAR(100),
    market_cap DECIMAL(20,2),
    face_value DECIMAL(10,2),
    isin VARCHAR(12) UNIQUE,
    listing_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Stock Prices Table (Time Series)
```sql
CREATE TABLE stock_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_id UUID REFERENCES stocks(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL,
    open_price DECIMAL(10,2) NOT NULL,
    high_price DECIMAL(10,2) NOT NULL,
    low_price DECIMAL(10,2) NOT NULL,
    close_price DECIMAL(10,2) NOT NULL,
    volume BIGINT NOT NULL,
    turnover DECIMAL(20,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for time series queries
CREATE INDEX idx_stock_prices_stock_timestamp ON stock_prices(stock_id, timestamp);
```

### Mutual Funds Table
```sql
CREATE TABLE mutual_funds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amc_code VARCHAR(10) NOT NULL,
    scheme_code VARCHAR(10) UNIQUE NOT NULL,
    scheme_name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    fund_type VARCHAR(50),
    nav DECIMAL(10,4),
    aum DECIMAL(20,2),
    expense_ratio DECIMAL(5,4),
    risk_level VARCHAR(20),
    minimum_investment DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Gold Prices Table
```sql
CREATE TABLE gold_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metal_type VARCHAR(20) NOT NULL, -- 'gold', 'silver', 'platinum'
    purity VARCHAR(10) NOT NULL, -- '24K', '22K', '18K'
    unit VARCHAR(10) NOT NULL, -- 'gram', 'kg', 'oz'
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    timestamp TIMESTAMP NOT NULL,
    source VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 💼 Trading & Investments

### Orders Table
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    trading_account_id UUID REFERENCES trading_accounts(id),
    order_type VARCHAR(20) NOT NULL, -- 'equity', 'mutual_fund', 'gold', 'crypto'
    instrument_type VARCHAR(20) NOT NULL, -- 'stock', 'mf', 'commodity'
    instrument_id UUID NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL, -- 'buy', 'sell'
    quantity DECIMAL(15,4) NOT NULL,
    price DECIMAL(10,2),
    order_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'filled', 'cancelled', 'rejected'
    order_side VARCHAR(10) NOT NULL, -- 'buy', 'sell'
    order_category VARCHAR(20) DEFAULT 'regular', -- 'regular', 'bracket', 'cover'
    validity VARCHAR(20) DEFAULT 'day', -- 'day', 'gtc', 'ioc'
    trigger_price DECIMAL(10,2),
    stop_loss DECIMAL(10,2),
    target_price DECIMAL(10,2),
    exchange_order_id VARCHAR(50),
    exchange_timestamp TIMESTAMP,
    executed_quantity DECIMAL(15,4) DEFAULT 0,
    executed_price DECIMAL(10,2),
    brokerage DECIMAL(10,2) DEFAULT 0,
    taxes DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Holdings Table
```sql
CREATE TABLE holdings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    instrument_type VARCHAR(20) NOT NULL,
    instrument_id UUID NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    quantity DECIMAL(15,4) NOT NULL,
    average_price DECIMAL(10,2) NOT NULL,
    current_price DECIMAL(10,2),
    market_value DECIMAL(15,2),
    unrealized_pnl DECIMAL(15,2),
    realized_pnl DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    transaction_type VARCHAR(20) NOT NULL, -- 'credit', 'debit'
    amount DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    description TEXT,
    reference_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Goals & Planning

### Financial Goals Table
```sql
CREATE TABLE financial_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    goal_name VARCHAR(200) NOT NULL,
    goal_type VARCHAR(50) NOT NULL, -- 'retirement', 'education', 'house', 'vacation'
    target_amount DECIMAL(15,2) NOT NULL,
    current_amount DECIMAL(15,2) DEFAULT 0,
    target_date DATE NOT NULL,
    priority INTEGER DEFAULT 1,
    risk_profile VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'paused'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### SIP Plans Table
```sql
CREATE TABLE sip_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES financial_goals(id),
    instrument_type VARCHAR(20) NOT NULL,
    instrument_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    frequency VARCHAR(20) DEFAULT 'monthly', -- 'weekly', 'monthly', 'quarterly'
    start_date DATE NOT NULL,
    end_date DATE,
    next_investment_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🤖 AI & Analytics

### AI Predictions Table
```sql
CREATE TABLE ai_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    instrument_type VARCHAR(20) NOT NULL,
    instrument_id UUID NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    prediction_type VARCHAR(50) NOT NULL, -- 'price', 'trend', 'sentiment'
    predicted_value DECIMAL(10,2),
    confidence_score DECIMAL(5,2),
    prediction_horizon VARCHAR(20), -- '1D', '1W', '1M', '3M'
    model_version VARCHAR(20),
    input_features JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);
```

### User Analytics Table
```sql
CREATE TABLE user_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'login', 'trade', 'view', 'search'
    event_data JSONB,
    session_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Market Sentiment Table
```sql
CREATE TABLE market_sentiment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    sentiment_score DECIMAL(3,2) NOT NULL, -- -1 to 1
    news_sentiment DECIMAL(3,2),
    social_sentiment DECIMAL(3,2),
    technical_sentiment DECIMAL(3,2),
    volume_sentiment DECIMAL(3,2),
    source VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📚 Educational Content

### Courses Table
```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructor VARCHAR(100),
    category VARCHAR(50),
    difficulty_level VARCHAR(20),
    duration_minutes INTEGER,
    price DECIMAL(10,2),
    is_free BOOLEAN DEFAULT false,
    thumbnail_url VARCHAR(255),
    video_url VARCHAR(255),
    content JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Progress Table
```sql
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    completed_lessons INTEGER DEFAULT 0,
    total_lessons INTEGER,
    last_accessed TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 💬 Communication

### Notifications Table
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'trade', 'market', 'goal', 'system'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    is_read BOOLEAN DEFAULT false,
    action_url VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);
```

### Chat Messages Table
```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(100),
    message_type VARCHAR(20) NOT NULL, -- 'user', 'bot', 'system'
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Security & Compliance

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### KYC Documents Table
```sql
CREATE TABLE kyc_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'pan', 'aadhar', 'bank_statement', 'address_proof'
    document_number VARCHAR(100),
    file_path VARCHAR(255),
    verification_status VARCHAR(20) DEFAULT 'pending',
    verified_by UUID,
    verified_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📊 Reporting & Analytics

### Daily Reports Table
```sql
CREATE TABLE daily_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    report_date DATE NOT NULL,
    portfolio_value DECIMAL(15,2),
    day_change DECIMAL(15,2),
    day_change_percent DECIMAL(5,2),
    total_investment DECIMAL(15,2),
    total_returns DECIMAL(15,2),
    realized_pnl DECIMAL(15,2),
    unrealized_pnl DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Market Reports Table
```sql
CREATE TABLE market_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_date DATE NOT NULL,
    market_cap DECIMAL(20,2),
    total_volume BIGINT,
    gainers INTEGER,
    losers INTEGER,
    unchanged INTEGER,
    nifty_level DECIMAL(10,2),
    sensex_level DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Database Indexes

### Performance Indexes
```sql
-- User queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Trading queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_holdings_user_id ON holdings(user_id);

-- Market data queries
CREATE INDEX idx_stock_prices_symbol_timestamp ON stock_prices(stock_id, timestamp);
CREATE INDEX idx_ai_predictions_user_instrument ON ai_predictions(user_id, instrument_id);

-- Analytics queries
CREATE INDEX idx_user_analytics_user_event ON user_analytics(user_id, event_type);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
```

## 🚀 Database Optimization

### Partitioning Strategy
```sql
-- Partition stock_prices by month
CREATE TABLE stock_prices_y2024m01 PARTITION OF stock_prices
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Partition audit_logs by month
CREATE TABLE audit_logs_y2024m01 PARTITION OF audit_logs
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### Caching Strategy
```redis
# Redis cache keys
SET user:123:profile {...}
SET user:123:holdings {...}
SET market:nifty:current {...}
SET stock:AAPL:price {...}
```

### Backup Strategy
- **Daily Backups**: Full database backup
- **Hourly Incremental**: Transaction log backup
- **Real-time Replication**: Master-slave setup
- **Disaster Recovery**: Multi-region backup

This comprehensive database schema supports all the features needed for a full-scale financial platform like GROW, Angel One, or Zerodha, with proper indexing, security, and scalability considerations.
