import WebSocket from 'ws';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { createServer } from 'http';

class RealTimeStockServer {
  constructor(port = 5001) {
    this.port = port;
    this.app = express();
    this.server = null;
    this.wss = null;
    this.clients = new Map();
    this.subscriptions = new Map();
    this.priceCache = new Map();
    this.marketStatus = 'open';
    this.updateInterval = null;
    
    this.setupExpress();
    this.setupWebSocket();
    this.startPriceUpdates();
  }

  setupExpress() {
    this.app.use(cors());
    this.app.use(express.json());

    // REST API endpoints for fallback
    this.app.post('/api/stocks/prices', async (req, res) => {
      try {
        const { symbols } = req.body;
        const prices = await this.fetchStockPrices(symbols);
        res.json({ success: true, prices });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    this.app.get('/api/market/news', async (req, res) => {
      try {
        const news = await this.fetchMarketNews();
        res.json({ success: true, news });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    this.app.post('/api/portfolio/performance', async (req, res) => {
      try {
        const { portfolio } = req.body;
        const performance = await this.calculatePortfolioPerformance(portfolio);
        res.json({ success: true, performance });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    this.app.get('/api/market/status', (req, res) => {
      res.json({ 
        success: true, 
        status: this.marketStatus,
        timestamp: new Date().toISOString()
      });
    });
  }

  setupWebSocket() {
    try {
      this.server = createServer(this.app);
      this.wss = new WebSocket.Server({ server: this.server });
      console.log('WebSocket server setup completed');
    } catch (error) {
      console.error('Error setting up WebSocket server:', error);
    }

    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, {
        ws,
        subscriptions: new Set(),
        lastPing: Date.now()
      });

      console.log(`Client connected: ${clientId}`);

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleClientMessage(clientId, data);
        } catch (error) {
          console.error('Error parsing client message:', error);
        }
      });

      ws.on('close', () => {
        console.log(`Client disconnected: ${clientId}`);
        this.clients.delete(clientId);
        this.cleanupSubscriptions(clientId);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
      });

      // Send initial market status
      this.sendToClient(clientId, {
        type: 'market_status',
        status: this.marketStatus
      });
    });

    // Ping clients every 30 seconds to keep connection alive
    setInterval(() => {
      this.pingClients();
    }, 30000);
  }

  handleClientMessage(clientId, data) {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (data.type) {
      case 'subscribe':
        this.subscribeToSymbol(clientId, data.symbol);
        break;
      case 'unsubscribe':
        this.unsubscribeFromSymbol(clientId, data.symbol);
        break;
      case 'ping':
        client.lastPing = Date.now();
        this.sendToClient(clientId, { type: 'pong' });
        break;
    }
  }

  subscribeToSymbol(clientId, symbol) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.subscriptions.add(symbol);
    
    if (!this.subscriptions.has(symbol)) {
      this.subscriptions.set(symbol, new Set());
    }
    this.subscriptions.get(symbol).add(clientId);

    // Send current price if available
    if (this.priceCache.has(symbol)) {
      this.sendToClient(clientId, {
        type: 'price_update',
        ...this.priceCache.get(symbol)
      });
    }

    console.log(`Client ${clientId} subscribed to ${symbol}`);
  }

  unsubscribeFromSymbol(clientId, symbol) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.subscriptions.delete(symbol);
    
    if (this.subscriptions.has(symbol)) {
      this.subscriptions.get(symbol).delete(clientId);
      if (this.subscriptions.get(symbol).size === 0) {
        this.subscriptions.delete(symbol);
      }
    }

    console.log(`Client ${clientId} unsubscribed from ${symbol}`);
  }

  cleanupSubscriptions(clientId) {
    for (const [symbol, subscribers] of this.subscriptions) {
      subscribers.delete(clientId);
      if (subscribers.size === 0) {
        this.subscriptions.delete(symbol);
      }
    }
  }

  sendToClient(clientId, message) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  broadcastToSubscribers(symbol, message) {
    if (this.subscriptions.has(symbol)) {
      this.subscriptions.get(symbol).forEach(clientId => {
        this.sendToClient(clientId, message);
      });
    }
  }

  async fetchStockPrices(symbols) {
    const prices = [];
    
    for (const symbol of symbols) {
      try {
        // Generate realistic mock data for demonstration
        const basePrice = this.getBasePrice(symbol);
        const priceChange = (Math.random() - 0.5) * 0.04; // ±2% change
        const newPrice = Math.max(basePrice * (1 + priceChange), 1);
        const change = newPrice - basePrice;
        const changePercent = (change / basePrice) * 100;
        
        const priceData = {
          symbol,
          price: Math.round(newPrice * 100) / 100,
          change: Math.round(change * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
          volume: Math.floor(Math.random() * 10000000) + 1000000,
          high: Math.round(newPrice * (1 + Math.random() * 0.02) * 100) / 100,
          low: Math.round(newPrice * (1 - Math.random() * 0.02) * 100) / 100,
          open: Math.round(basePrice * 100) / 100,
          previousClose: Math.round(basePrice * 100) / 100,
          timestamp: new Date().toISOString()
        };

        prices.push(priceData);
        this.priceCache.set(symbol, priceData);
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        // Use cached data if available
        if (this.priceCache.has(symbol)) {
          prices.push(this.priceCache.get(symbol));
        }
      }
    }

    return prices;
  }

  getBasePrice(symbol) {
    // Base prices for common symbols
    const basePrices = {
      'AAPL': 150.00,
      'GOOGL': 2800.00,
      'MSFT': 350.00,
      'AMZN': 3200.00,
      'TSLA': 250.00,
      'NVDA': 450.00,
      'META': 300.00,
      'NFLX': 400.00,
      'AMD': 120.00,
      'INTC': 50.00,
      'CRM': 200.00,
      'ORCL': 100.00,
      'ADBE': 500.00,
      'PYPL': 80.00,
      'UBER': 40.00
    };
    
    return basePrices[symbol] || 100.00;
  }

  async fetchMarketNews() {
    try {
      // Using a free news API (you can replace with your preferred news source)
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: 'stock market OR investing OR finance',
          sortBy: 'publishedAt',
          pageSize: 10,
          apiKey: process.env.NEWS_API_KEY || 'your-news-api-key'
        }
      });

      return response.data.articles.map(article => ({
        id: article.url,
        title: article.title,
        summary: article.description,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name,
        impact: this.analyzeNewsImpact(article.title, article.description)
      }));
    } catch (error) {
      console.error('Error fetching market news:', error);
      // Return mock news if API fails
      return this.getMockNews();
    }
  }

  getMockNews() {
    return [
      {
        id: '1',
        title: 'Tech Stocks Rally on AI Optimism',
        summary: 'Major tech companies see gains as AI adoption accelerates across industries.',
        publishedAt: new Date().toISOString(),
        source: 'Financial Times',
        impact: 'positive'
      },
      {
        id: '2',
        title: 'Federal Reserve Hints at Rate Stability',
        summary: 'Latest Fed comments suggest interest rates may remain stable through Q4.',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        source: 'Reuters',
        impact: 'neutral'
      },
      {
        id: '3',
        title: 'Energy Sector Faces Headwinds',
        summary: 'Oil prices decline amid global economic uncertainty.',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        source: 'Bloomberg',
        impact: 'negative'
      }
    ];
  }

  analyzeNewsImpact(title, description) {
    const positiveKeywords = ['rally', 'gains', 'growth', 'optimism', 'surge', 'boost'];
    const negativeKeywords = ['decline', 'fall', 'drop', 'uncertainty', 'headwinds', 'concerns'];
    
    const text = (title + ' ' + description).toLowerCase();
    
    const positiveCount = positiveKeywords.filter(keyword => text.includes(keyword)).length;
    const negativeCount = negativeKeywords.filter(keyword => text.includes(keyword)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  async calculatePortfolioPerformance(portfolio) {
    try {
      const symbols = portfolio.map(investment => investment.symbol);
      const prices = await this.fetchStockPrices(symbols);
      
      let totalInvested = 0;
      let totalCurrentValue = 0;
      let totalGainLoss = 0;
      
      const performance = portfolio.map(investment => {
        const currentPrice = prices.find(p => p.symbol === investment.symbol);
        const currentValue = currentPrice ? currentPrice.price * investment.shares : investment.currentValue;
        const gainLoss = currentValue - investment.amountInvested;
        const returnPercent = (gainLoss / investment.amountInvested) * 100;
        
        totalInvested += investment.amountInvested;
        totalCurrentValue += currentValue;
        totalGainLoss += gainLoss;
        
        return {
          ...investment,
          currentValue,
          gainLoss,
          returnPercent,
          lastUpdated: new Date().toISOString()
        };
      });
      
      const totalReturnPercent = (totalGainLoss / totalInvested) * 100;
      
      return {
        performance,
        summary: {
          totalInvested,
          totalCurrentValue,
          totalGainLoss,
          totalReturnPercent,
          lastUpdated: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error calculating portfolio performance:', error);
      throw error;
    }
  }

  startPriceUpdates() {
    // Update prices every 5 seconds
    this.updateInterval = setInterval(async () => {
      if (this.subscriptions.size > 0) {
        const symbols = Array.from(this.subscriptions.keys());
        try {
          const prices = await this.fetchStockPrices(symbols);
          
          prices.forEach(priceData => {
            this.broadcastToSubscribers(priceData.symbol, {
              type: 'price_update',
              ...priceData
            });
          });
        } catch (error) {
          console.error('Error updating prices:', error);
        }
      }
    }, 5000);
  }

  pingClients() {
    this.clients.forEach((client, clientId) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.ping();
      } else {
        this.clients.delete(clientId);
        this.cleanupSubscriptions(clientId);
      }
    });
  }

  generateClientId() {
    return Math.random().toString(36).substr(2, 9);
  }

  start() {
    try {
      this.server.listen(this.port, () => {
        console.log(`Real-time stock server running on port ${this.port}`);
        console.log(`WebSocket server available at ws://localhost:${this.port}/ws`);
        // Start price updates
        this.startPriceUpdates();
      });
    } catch (error) {
      console.error('Error starting server:', error);
    }
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    this.clients.forEach(client => {
      client.ws.close();
    });
    
    if (this.server) {
      this.server.close();
    }
  }
}

// Export the class for use in other modules
export default RealTimeStockServer;

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new RealTimeStockServer();
  server.start();
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down real-time stock server...');
    server.stop();
    process.exit(0);
  });
}
