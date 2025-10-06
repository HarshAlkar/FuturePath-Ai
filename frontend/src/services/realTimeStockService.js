import { getAuthToken } from './api';

class RealTimeStockService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000;
    this.subscribers = new Map();
    this.priceCache = new Map();
    this.lastUpdate = null;
  }

  // Initialize WebSocket connection
  connect() {
    try {
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? 'wss://your-production-websocket-url.com/ws'
        : 'ws://localhost:5001/ws';
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.emit('disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };

    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.emit('error', error);
    }
  }

  // Handle incoming WebSocket messages
  handleMessage(data) {
    switch (data.type) {
      case 'price_update':
        this.updatePrice(data.symbol, data.price, data.change, data.changePercent);
        break;
      case 'market_status':
        this.emit('marketStatus', data.status);
        break;
      case 'news_alert':
        this.emit('newsAlert', data.news);
        break;
      case 'portfolio_update':
        this.emit('portfolioUpdate', data.portfolio);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  // Update price data and notify subscribers
  updatePrice(symbol, price, change, changePercent) {
    const priceData = {
      symbol,
      price: parseFloat(price),
      change: parseFloat(change),
      changePercent: parseFloat(changePercent),
      timestamp: new Date(),
      lastUpdated: new Date().toLocaleTimeString()
    };

    this.priceCache.set(symbol, priceData);
    this.lastUpdate = new Date();

    // Notify all subscribers for this symbol
    if (this.subscribers.has(symbol)) {
      this.subscribers.get(symbol).forEach(callback => {
        try {
          callback(priceData);
        } catch (error) {
          console.error('Error in price update callback:', error);
        }
      });
    }

    // Emit global price update event
    this.emit('priceUpdate', priceData);
  }

  // Subscribe to price updates for a specific symbol
  subscribeToSymbol(symbol, callback) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }
    this.subscribers.get(symbol).add(callback);

    // Send subscription request to server
    if (this.isConnected) {
      this.send({
        type: 'subscribe',
        symbol: symbol
      });
    }

    // Return cached price if available
    if (this.priceCache.has(symbol)) {
      callback(this.priceCache.get(symbol));
    }

    return () => this.unsubscribeFromSymbol(symbol, callback);
  }

  // Unsubscribe from price updates
  unsubscribeFromSymbol(symbol, callback) {
    if (this.subscribers.has(symbol)) {
      this.subscribers.get(symbol).delete(callback);
      
      if (this.subscribers.get(symbol).size === 0) {
        this.subscribers.delete(symbol);
        // Send unsubscribe request to server
        if (this.isConnected) {
          this.send({
            type: 'unsubscribe',
            symbol: symbol
          });
        }
      }
    }
  }

  // Subscribe to multiple symbols
  subscribeToPortfolio(symbols, callback) {
    const unsubscribers = symbols.map(symbol => 
      this.subscribeToSymbol(symbol, callback)
    );

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }

  // Send message to WebSocket server
  send(message) {
    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message:', message);
    }
  }

  // Attempt to reconnect
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
    }
  }

  // Get current price for a symbol
  getCurrentPrice(symbol) {
    return this.priceCache.get(symbol);
  }

  // Get all cached prices
  getAllPrices() {
    return Array.from(this.priceCache.values());
  }

  // Get market status
  getMarketStatus() {
    return this.isConnected ? 'open' : 'closed';
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.subscribers.clear();
    this.priceCache.clear();
  }

  // Event emitter methods
  on(event, callback) {
    if (!this.eventListeners) {
      this.eventListeners = new Map();
    }
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this.eventListeners && this.eventListeners.has(event)) {
      this.eventListeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.eventListeners && this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event callback:', error);
        }
      });
    }
  }

  // Fallback to REST API when WebSocket is not available
  async fetchPriceData(symbols) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stocks/prices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ symbols })
      });

      if (response.ok) {
        const data = await response.json();
        data.prices.forEach(priceData => {
          this.updatePrice(priceData.symbol, priceData.price, priceData.change, priceData.changePercent);
        });
        return data;
      } else {
        throw new Error('Failed to fetch price data');
      }
    } catch (error) {
      console.error('Error fetching price data:', error);
      throw error;
    }
  }

  // Get real-time market news
  async fetchMarketNews() {
    try {
      const token = getAuthToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/market/news`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.emit('marketNews', data.news);
        return data;
      } else {
        throw new Error('Failed to fetch market news');
      }
    } catch (error) {
      console.error('Error fetching market news:', error);
      throw error;
    }
  }

  // Get portfolio performance data
  async fetchPortfolioPerformance(portfolio) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/portfolio/performance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ portfolio })
      });

      if (response.ok) {
        const data = await response.json();
        this.emit('portfolioPerformance', data);
        return data;
      } else {
        throw new Error('Failed to fetch portfolio performance');
      }
    } catch (error) {
      console.error('Error fetching portfolio performance:', error);
      throw error;
    }
  }
}

// Create singleton instance
const realTimeStockService = new RealTimeStockService();

export default realTimeStockService;
