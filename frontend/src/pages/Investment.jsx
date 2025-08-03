import React, { useState } from 'react';
import { BarChart3, Bell, Settings, User, Search, TrendingUp, TrendingDown, ChevronDown, Plus, Link, Bot, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';
import MainDashboardNavbar from './main_dashboard_navbar';

const Investment = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6M');
  const [assetFilter, setAssetFilter] = useState('All Types');

  const investments = [
    {
      name: 'S&P 500 ETF',
      type: 'Stock',
      amountInvested: '$10,000',
      currentValue: '$12,500',
      return: '+25%',
      returnColor: 'text-green-500',
      risk: 'Moderate',
      riskColor: 'bg-yellow-100 text-yellow-700',
      icon: '📈'
    },
    {
      name: 'US Treasury Bonds',
      type: 'Bond',
      amountInvested: '$5,000',
      currentValue: '$5,250',
      return: '+5%',
      returnColor: 'text-green-500',
      risk: 'Low',
      riskColor: 'bg-green-100 text-green-700',
      icon: '🏛️'
    },
    {
      name: 'Bitcoin',
      type: 'Crypto',
      amountInvested: '$8,000',
      currentValue: '$12,000',
      return: '+50%',
      returnColor: 'text-green-500',
      risk: 'High',
      riskColor: 'bg-red-100 text-red-700',
      icon: '₿'
    }
  ];

  const suggestions = [
    {
      title: 'Index Fund',
      expectedReturn: '8-12%',
      minInvestment: '$100',
      risk: 'Low',
      riskColor: 'text-green-600',
      icon: '📊'
    },
    {
      title: 'Tech Stocks',
      expectedReturn: '15-25%',
      minInvestment: '$500',
      risk: 'High',
      riskColor: 'text-red-600',
      icon: '💻'
    },
    {
      title: 'Real Estate',
      expectedReturn: '6-10%',
      minInvestment: '$10,000',
      risk: 'Moderate',
      riskColor: 'text-yellow-600',
      icon: '🏠'
    },
    {
      title: 'Green Energy',
      expectedReturn: '12-18%',
      minInvestment: '$500',
      risk: 'Moderate',
      riskColor: 'text-yellow-600',
      icon: '🌱'
    }
  ];

  const smartTips = [
    "You're underinvested in low-risk assets. Consider diversifying your portfolio.",
    "Your SIP in Tech Fund is underperforming. Review allocation.",
    "Your emergency fund is well-funded at 6 months of expenses."
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MainDashboardNavbar />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Snapshot */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Portfolio Snapshot</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Invested</p>
                <div className="p-1 bg-blue-50 rounded">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">$45,320</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Current Value</p>
                <div className="p-1 bg-blue-50 rounded">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">$52,890</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Returns</p>
                <div className="p-1 bg-green-50 rounded">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-green-600">+16.7%</p>
                <span className="text-sm text-gray-500">($7,570)</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Risk Level</p>
                <div className="p-1 bg-yellow-50 rounded">
                  <BarChart3 className="w-4 h-4 text-yellow-600" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Moderate</p>
                <span className="inline-block bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded mt-1">Moderate</span>
              </div>
            </div>
          </div>

          {/* Chart Section - Apple Stock Style */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Left side - Chart */}
              <div className="lg:col-span-2 p-4 lg:p-6">
                {/* Stock Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">🍎</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Apple Inc</h2>
                      <p className="text-gray-500">AAPL</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">-1.52%</span>
                      <span className="text-2xl font-bold text-gray-900">$150.70</span>
                    </div>
                    <p className="text-sm text-gray-500">Last update at 14:30</p>
                  </div>
                </div>

                {/* Time Period Buttons */}
                <div className="flex flex-wrap items-center space-x-2 mb-6">
                  <button className="px-3 py-1 rounded text-sm text-gray-500 hover:bg-gray-100">1 Day</button>
                  <button className="px-3 py-1 rounded text-sm bg-black text-white">1 Week</button>
                  <button className="px-3 py-1 rounded text-sm text-gray-500 hover:bg-gray-100">1 Month</button>
                  <button className="px-3 py-1 rounded text-sm text-gray-500 hover:bg-gray-100">3 Month</button>
                  <button className="px-3 py-1 rounded text-sm text-gray-500 hover:bg-gray-100">6 Month</button>
                  <button className="px-3 py-1 rounded text-sm text-gray-500 hover:bg-gray-100">1 Year</button>
                  <button className="px-3 py-1 rounded text-sm text-gray-500 hover:bg-gray-100">5 Year</button>
                  <button className="px-3 py-1 rounded text-sm text-gray-500 hover:bg-gray-100 flex items-center space-x-1">
                    <span>📊</span>
                    <span>All</span>
                  </button>
                </div>
                
                {/* Apple Stock Chart */}
                <div className="h-64 lg:h-80 relative bg-gray-50 rounded-lg overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
                    {/* Grid lines */}
                    <g stroke="#E5E7EB" strokeWidth="0.5" opacity="0.5">
                      <line x1="0" y1="60" x2="800" y2="60" />
                      <line x1="0" y1="120" x2="800" y2="120" />
                      <line x1="0" y1="180" x2="800" y2="180" />
                      <line x1="0" y1="240" x2="800" y2="240" />
                    </g>
                    
                    {/* Y-axis labels */}
                    <text x="20" y="270" className="text-xs fill-gray-400" fontSize="10">50</text>
                    <text x="20" y="210" className="text-xs fill-gray-400" fontSize="10">100</text>
                    <text x="20" y="150" className="text-xs fill-gray-400" fontSize="10">150</text>
                    <text x="20" y="90" className="text-xs fill-gray-400" fontSize="10">200</text>
                    <text x="20" y="30" className="text-xs fill-gray-400" fontSize="10">250</text>
                    <text x="20" y="10" className="text-xs fill-gray-400" fontSize="10">300</text>
                    
                    {/* Apple Stock Price Line (mimicking the uploaded chart) */}
                    <path
                      d="M 60,200 L 80,180 L 100,160 L 120,140 L 140,150 L 160,130 L 180,120 L 200,110 L 220,90 L 240,80 L 260,60 L 280,70 L 300,85 L 320,95 L 340,110 L 360,130 L 380,120 L 400,135 L 420,145 L 440,130 L 460,140 L 480,155 L 500,170 L 520,160 L 540,150 L 560,135 L 580,120 L 600,110 L 620,95 L 640,80 L 660,70 L 680,85 L 700,100 L 720,115 L 740,130 L 760,145"
                      stroke="#10B981"
                      strokeWidth="2"
                      fill="none"
                    />
                    
                    {/* Vertical dashed line for current position */}
                    <line x1="300" y1="0" x2="300" y2="300" stroke="#6B7280" strokeWidth="1" strokeDasharray="5,5" opacity="0.7" />
                    
                    {/* Tooltip */}
                    <g>
                      <rect x="220" y="40" width="120" height="40" rx="8" fill="#374151" opacity="0.9" />
                      <text x="235" y="55" className="text-xs fill-white" fontSize="10">21 Sept on 12:00</text>
                      <text x="235" y="70" className="text-xs fill-white" fontSize="12" fontWeight="bold">$190.70.20</text>
                    </g>
                    
                    {/* X-axis labels */}
                    <text x="100" y="290" className="text-xs fill-gray-400" fontSize="10">15</text>
                    <text x="200" y="290" className="text-xs fill-gray-400" fontSize="10">16</text>
                    <text x="300" y="290" className="text-xs fill-gray-400" fontSize="10">17</text>
                    <text x="400" y="290" className="text-xs fill-gray-400" fontSize="10">18</text>
                    <text x="500" y="290" className="text-xs fill-gray-400" fontSize="10">19</text>
                    <text x="600" y="290" className="text-xs fill-gray-400" fontSize="10">20</text>
                    <text x="700" y="290" className="text-xs fill-gray-400" fontSize="10">21</text>
                    <text x="760" y="290" className="text-xs fill-gray-400" fontSize="10">22</text>
                  </svg>
                </div>
              </div>

              {/* Right side - Watchlist */}
              <div className="bg-gray-50 p-4 lg:p-6 border-l border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">My watchlist</h3>
                  <button className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                    <span className="text-gray-600 text-lg">+</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Spotify */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">♪</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">SPOT</h4>
                        <p className="text-sm text-gray-500">Spotify</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">$310.40</p>
                      <p className="text-sm text-red-500">- 1.10%</p>
                    </div>
                  </div>
                  
                  {/* Airbnb */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">A</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">ABNB</h4>
                        <p className="text-sm text-gray-500">Airbnb</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">$132.72</p>
                      <p className="text-sm text-red-500">- 10.29%</p>
                    </div>
                  </div>
                  
                  {/* Shopify */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">S</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">SHOP</h4>
                        <p className="text-sm text-gray-500">Shopify</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">$28.57</p>
                      <p className="text-sm text-red-500">- 6.48%</p>
                    </div>
                  </div>
                  
                  {/* Sony PlayStation */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🎮</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">SONY</h4>
                        <p className="text-sm text-gray-500">PlayStation</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">$71.86</p>
                      <p className="text-sm text-green-500">+ 0.98%</p>
                    </div>
                  </div>
                  
                  {/* Dropbox */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">📦</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">DBX</h4>
                        <p className="text-sm text-gray-500">Dropbox Inc</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">$20.44</p>
                      <p className="text-sm text-red-500">- 3.08%</p>
                    </div>
                  </div>
                  
                  {/* PayPal */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">P</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">PYPL</h4>
                        <p className="text-sm text-gray-500">Paypal</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">$87.66</p>
                      <p className="text-sm text-red-500">- 3.86%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Investments */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Investments</h2>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search investments..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <select 
                  value={assetFilter}
                  onChange={(e) => setAssetFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>All Types</option>
                  <option>Stocks</option>
                  <option>Bonds</option>
                  <option>Crypto</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Invested</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {investments.map((investment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{investment.icon}</span>
                          <span className="text-sm font-medium text-gray-900">{investment.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investment.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investment.amountInvested}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investment.currentValue}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${investment.returnColor}`}>{investment.return}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${investment.riskColor}`}>
                          {investment.risk}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Smart Suggestions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Smart Suggestions for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">{suggestion.icon}</span>
                  <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expected Return</span>
                    <span className="text-sm font-medium text-gray-900">{suggestion.expectedReturn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Minimum Investment</span>
                    <span className="text-sm font-medium text-gray-900">{suggestion.minInvestment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Risk Level</span>
                    <span className={`text-sm font-medium ${suggestion.riskColor}`}>{suggestion.risk}</span>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add New Investment</span>
          </button>
          <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg flex items-center space-x-2">
            <Link className="w-5 h-5" />
            <span>Connect Account</span>
          </button>
          <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>Enable AI Advisor</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-bold text-gray-900">FuturePath AI</span>
              </div>
              <p className="text-sm text-gray-600">Making smart investing accessible to everyone.</p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Features</a></li>
                <li><a href="#" className="hover:text-gray-900">Security</a></li>
                <li><a href="#" className="hover:text-gray-900">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900">Support</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 mt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">© 2024 FuturePath AI. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Twitter className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <Facebook className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Investment; 