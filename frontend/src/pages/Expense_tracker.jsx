import React, { useState } from 'react';
import { Bell, User, Edit, Calendar, Camera, Mic, Search, Filter, TrendingUp, TrendingDown, Clock, Edit2, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import MainDashboardNavbar from './main_dashboard_navbar';

const Expense_tracker = () => {
  const [smsSync, setSmsSync] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  
  // Sample data for pie chart
  const categoryData = [
    { name: 'Groceries', value: 35, color: '#3b82f6' },
    { name: 'Transport', value: 25, color: '#10b981' },
    { name: 'Entertainment', value: 20, color: '#f59e0b' },
    { name: 'Bills', value: 15, color: '#ef4444' },
    { name: 'Others', value: 5, color: '#8b5cf6' }
  ];

  const recentTransactions = [
    { id: 1, date: 'Jan 15, 2024', description: 'Grocery Shopping', category: 'Groceries', amount: '₹2,500' },
    { id: 2, date: 'Jan 14, 2024', description: 'Uber Ride', category: 'Transport', amount: '₹350' },
    { id: 3, date: 'Jan 14, 2024', description: 'Movie Tickets', category: 'Entertainment', amount: '₹600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MainDashboardNavbar />

      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
          <p className="text-gray-600 mb-4">Track all your daily expenses easily</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Add New Transaction
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Manual Entry */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Edit className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manual Entry</h3>
                <p className="text-sm text-gray-600">Quick and easy manual expense logging</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Select category</option>
                  <option>Groceries</option>
                  <option>Transport</option>
                  <option>Entertainment</option>
                  <option>Bills</option>
                  <option>Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="yyyy / mm / dd"
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Add a note..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Save Expense
              </button>
            </div>
          </div>

          {/* Scan Receipt */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Scan Receipt</h3>
                <p className="text-sm text-gray-600">Extract expense details from receipts</p>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">Upload or snap a picture of your receipt</p>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                Upload Receipt
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Parsed Details</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Vendor: XYZ Store</p>
                <p>Date: Jan 15, 2024</p>
                <p>Amount: ₹2,000.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-Sync and Voice Input */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Auto-Sync */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-purple-600 rounded"></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Auto-Sync</h3>
                <p className="text-sm text-gray-600">Connect your SMS and Gmail</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">SMS Sync</div>
                  <div className="text-sm text-gray-600">Track expenses from SMS</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsSync}
                    onChange={(e) => setSmsSync(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Gmail Sync</div>
                  <div className="text-sm text-gray-600">Track expenses from emails</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                View Parsed Transactions →
              </button>
            </div>
          </div>

          {/* Voice Input */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Voice Input</h3>
                <p className="text-sm text-gray-600">Log expenses using voice commands</p>
              </div>
            </div>

            <div className="text-center py-8">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${
                  isRecording ? 'bg-red-500 animate-pulse' : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                <Mic className="w-8 h-8 text-white" />
              </button>
              <p className="text-gray-600 text-sm mb-6">Tap to start speaking</p>
              
              <div className="text-left">
                <h4 className="font-medium text-gray-900 mb-2">Example Commands</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• "Add ₹500 for groceries today"</li>
                  <li>• "Log ₹2000 restaurant expense"</li>
                  <li>• "Record ₹1000 transport expense"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">{transaction.date}</td>
                    <td className="py-3 px-4 text-gray-900">{transaction.description}</td>
                    <td className="py-3 px-4 text-gray-600">{transaction.category}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{transaction.amount}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards and Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Summary Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Total Income</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">₹50,000</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-600">Total Expenses</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">₹35,000</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Net Balance</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">₹15,000</div>
            </div>
          </div>

          {/* Spending Categories Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Categories</h3>
            
            <div className="flex items-center justify-center mb-4">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-2">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: category.color }}></div>
                    <span className="text-sm text-gray-600">{category.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{category.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-sm font-medium text-gray-900">FuturePath AI</span>
          </div>
          
          <div className="flex space-x-6 text-sm text-gray-600">
            <span>Help Center</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
          
          <div className="flex space-x-4 text-gray-400">
            <div className="w-5 h-5 border border-gray-400 rounded"></div>
            <div className="w-5 h-5 border border-gray-400 rounded"></div>
            <div className="w-5 h-5 border border-gray-400 rounded"></div>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-4">
          © 2024 FuturePath AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Expense_tracker; 