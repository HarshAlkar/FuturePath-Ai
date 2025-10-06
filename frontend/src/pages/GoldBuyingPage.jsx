import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Wallet, IndianRupee, CheckCircle, Shield, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const GoldBuyingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Get metal data from navigation state
    if (location.state?.metal) {
      setSelectedMetal(location.state.metal);
    } else {
      // Fallback to default gold data
      setSelectedMetal({
        symbol: 'XAU',
        name: 'Gold',
        price: 68500,
        currency: 'INR',
        unit: '10g'
      });
    }
  }, [location.state]);

  const calculateTotal = () => {
    if (!selectedMetal) return 0;
    return selectedMetal.price * quantity;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`✅ Successfully purchased ${quantity} ${selectedMetal?.unit} of ${selectedMetal?.name}!`);
    
    // Redirect back to gold dashboard
    setTimeout(() => {
      navigate('/gold-dashboard');
    }, 1500);
  };

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '📱', description: 'Pay using UPI apps' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Pay using your card' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦', description: 'Pay using net banking' },
    { id: 'wallet', name: 'Digital Wallet', icon: '💰', description: 'Pay using digital wallet' }
  ];

  if (!selectedMetal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 border-b ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/gold-dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Gold Dashboard</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Metal Info Card */}
          <div className={`rounded-xl p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg border-2`} style={{
            borderColor: selectedMetal.symbol === 'XAU' ? '#fbbf24' :
                        selectedMetal.symbol === 'XAG' ? '#9ca3af' :
                        selectedMetal.symbol === 'XPT' ? '#3b82f6' : '#8b5cf6'
          }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                  selectedMetal.symbol === 'XAU' ? 'bg-yellow-100 text-yellow-600' :
                  selectedMetal.symbol === 'XAG' ? 'bg-gray-100 text-gray-600' :
                  selectedMetal.symbol === 'XPT' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  {selectedMetal.symbol === 'XAU' ? '🥇' : 
                   selectedMetal.symbol === 'XAG' ? '🥈' : 
                   selectedMetal.symbol === 'XPT' ? '💎' : '⭐'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{selectedMetal.name}</h1>
                  <p className="text-gray-500">{selectedMetal.symbol} • Per {selectedMetal.unit}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  {formatPrice(selectedMetal.price)}
                </div>
                <p className="text-sm text-gray-500">Current Market Price</p>
              </div>
            </div>
          </div>

          {/* Purchase Form */}
          <div className={`rounded-xl p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h2 className="text-xl font-bold mb-6">Purchase Details</h2>
            
            {/* Quantity Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Quantity</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-2xl font-bold min-w-[60px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  +
                </button>
                <span className="text-gray-500 ml-4">{selectedMetal.unit}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Payment Method</label>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div className="text-left">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-500">{method.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className={`rounded-lg p-4 mb-6 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{selectedMetal.name} ({quantity} {selectedMetal.unit})</span>
                  <span>{formatPrice(selectedMetal.price * quantity)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee</span>
                  <span>{formatPrice(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (3%)</span>
                  <span>{formatPrice(selectedMetal.price * quantity * 0.03)}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-green-600">{formatPrice(calculateTotal() * 1.03)}</span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="flex items-center space-x-6 mb-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>24/7 Support</span>
              </div>
            </div>

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition-colors"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <IndianRupee className="w-6 h-6" />
                  <span>Pay {formatPrice(calculateTotal() * 1.03)}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GoldBuyingPage;
