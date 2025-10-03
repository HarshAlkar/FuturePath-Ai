import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PriceAlerts = ({ darkMode, isOpen, onClose, goldPrices = [] }) => {
  const [alerts, setAlerts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    symbol: 'XAU',
    type: 'above',
    targetPrice: ''
  });

  const API_BASE = 'http://localhost:5001/api';

  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
    }
  }, [isOpen]);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/gold/alerts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAlerts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  const createAlert = async () => {
    if (!newAlert.targetPrice) {
      toast.error('Please enter a target price');
      return;
    }

    try {
      await axios.post(`${API_BASE}/gold/alerts`, newAlert, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      toast.success('Price alert created successfully!');
      setNewAlert({ symbol: 'XAU', type: 'above', targetPrice: '' });
      setShowCreateForm(false);
      fetchAlerts();
    } catch (error) {
      toast.error('Failed to create alert');
    }
  };

  const deleteAlert = async (alertId) => {
    try {
      await axios.delete(`${API_BASE}/gold/alerts/${alertId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      toast.success('Alert deleted successfully!');
      fetchAlerts();
    } catch (error) {
      toast.error('Failed to delete alert');
    }
  };

  const commodities = [
    { symbol: 'XAU', name: 'Gold' },
    { symbol: 'XAG', name: 'Silver' },
    { symbol: 'XPT', name: 'Platinum' },
    { symbol: 'XPD', name: 'Palladium' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-2xl`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <Bell className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Price Alerts
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Alert</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className={`p-2 rounded-lg ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  } transition-colors`}
                >
                  <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Create Alert Form */}
              <AnimatePresence>
                {showCreateForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`mb-6 p-4 rounded-lg border ${
                      darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Create New Alert
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Commodity
                        </label>
                        <select
                          value={newAlert.symbol}
                          onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                          className={`w-full p-2 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-800 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        >
                          {commodities.map(commodity => (
                            <option key={commodity.symbol} value={commodity.symbol}>
                              {commodity.name} ({commodity.symbol})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Alert Type
                        </label>
                        <select
                          value={newAlert.type}
                          onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                          className={`w-full p-2 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-800 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        >
                          <option value="above">Price Above</option>
                          <option value="below">Price Below</option>
                        </select>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Target Price ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={newAlert.targetPrice}
                          onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                          placeholder="Enter price"
                          className={`w-full p-2 rounded-lg border ${
                            darkMode 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateForm(false)}
                        className={`px-4 py-2 rounded-lg ${
                          darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                        } transition-colors`}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={createAlert}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Create Alert
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Alerts List */}
              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No price alerts set</p>
                    <p className="text-sm">Create your first alert to get notified of price changes</p>
                  </div>
                ) : (
                  alerts.map((alert) => {
                    const commodity = commodities.find(c => c.symbol === alert.symbol);
                    const currentPrice = goldPrices.find(p => p.symbol === alert.symbol)?.price || 0;
                    const isTriggered = !alert.isActive;
                    
                    return (
                      <motion.div
                        key={alert._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg border ${
                          isTriggered
                            ? darkMode ? 'border-green-600 bg-green-900/20' : 'border-green-200 bg-green-50'
                            : darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${
                              alert.type === 'above' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {alert.type === 'above' ? (
                                <TrendingUp className={`w-5 h-5 ${
                                  alert.type === 'above' ? 'text-green-600' : 'text-red-600'
                                }`} />
                              ) : (
                                <TrendingDown className="w-5 h-5 text-red-600" />
                              )}
                            </div>
                            
                            <div>
                              <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {commodity?.name} ({alert.symbol})
                              </div>
                              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Alert when price goes {alert.type} ${alert.targetPrice}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                Current: ${currentPrice.toFixed(2)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {isTriggered && (
                              <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                                Triggered
                              </span>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => deleteAlert(alert._id)}
                              className={`p-2 rounded-lg ${
                                darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                              } transition-colors`}
                            >
                              <Trash2 className={`w-4 h-4 ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PriceAlerts;
