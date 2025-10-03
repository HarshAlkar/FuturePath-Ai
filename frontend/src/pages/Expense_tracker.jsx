import React, { useState, useEffect } from 'react';
import { Bell, User, Edit, Calendar, Camera, Mic, Search, Filter, TrendingUp, TrendingDown, Clock, Edit2, Trash2, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import MainDashboardNavbar from './main_dashboard_navbar';
import transactionService from '../services/transactionService';
import authService from '../services/authService';
import ocrService from '../services/ocrService';

const Expense_tracker = () => {
  const [smsSync, setSmsSync] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [voiceConfirmationData, setVoiceConfirmationData] = useState(null);
  const [showVoiceConfirmation, setShowVoiceConfirmation] = useState(false);
  const [showDeleteAllConfirmation, setShowDeleteAllConfirmation] = useState(false);
  const [receiptImage, setReceiptImage] = useState(null);
  const [parsedReceipt, setParsedReceipt] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptValidationWarnings, setReceiptValidationWarnings] = useState([]);

  // Fetch transactions on component mount
  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      console.error('No authentication token found');
      alert('Please log in to access the expense tracker');
      // Redirect to login page
      window.location.href = '/login';
      return;
    }
    
    console.log('User is authenticated');
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await transactionService.getTransactions();
      setTransactions(data);
      updateCategoryData(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      if (error.message.includes('authentication') || error.message.includes('token')) {
        alert('Authentication error. Please log in again.');
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategoryData = (transactions) => {
    const categoryTotals = {};
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
      }
    });

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
    const data = Object.entries(categoryTotals).map(([category, value], index) => ({
      name: category,
      value: value,
      color: colors[index % colors.length]
    }));

    setCategoryData(data);
  };

  const updateFinancialSummary = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses
    };
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    
    // Frontend validation
    if (!expenseForm.amount || expenseForm.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!expenseForm.category) {
      alert('Please select a category');
      return;
    }
    if (!expenseForm.description.trim()) {
      alert('Please enter a description');
      return;
    }

    try {
      await transactionService.addTransaction({
        ...expenseForm,
        amount: Number(expenseForm.amount)
      });
      
        // Reset form
        setExpenseForm({
        type: 'expense',
          amount: '',
          category: '',
          description: '',
        date: new Date().toISOString().split('T')[0]
        });
      
      // Refresh transactions
      await fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction');
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await transactionService.updateTransaction(id, updatedData);
      await fetchTransactions();
      setShowEditModal(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        console.log('Attempting to delete transaction with ID:', id);
        await transactionService.deleteTransaction(id);
        await fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert(`Failed to delete transaction: ${error.message}`);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (transactions.length === 0) {
      alert('No transactions to delete');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Attempting to delete all transactions');
      
      // Delete all transactions one by one
      const deletePromises = transactions.map(transaction => 
        transactionService.deleteTransaction(transaction._id)
      );
      
      await Promise.all(deletePromises);
      await fetchTransactions();
      
      alert('All transactions have been deleted successfully');
    } catch (error) {
      console.error('Error deleting all transactions:', error);
      alert(`Failed to delete all transactions: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        setIsRecording(true);
      };
      
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        processVoiceCommand(transcript);
      };
      
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
    recognition.onend = () => {
        setIsRecording(false);
      };
      
    recognition.start();
  };

  const processVoiceCommand = (transcript) => {
    console.log('Voice command:', transcript);
    
    // Check for delete commands first
    const deleteKeywords = ['delete', 'remove', 'cancel', 'erase', 'clear'];
    const isDeleteCommand = deleteKeywords.some(keyword => transcript.includes(keyword));
    
    if (isDeleteCommand) {
      // Check for "delete all" or "clear all" commands
      const allKeywords = ['all', 'everything', 'clear all', 'delete all', 'remove all'];
      const isDeleteAllCommand = allKeywords.some(keyword => transcript.includes(keyword));
      
      if (isDeleteAllCommand) {
        setVoiceConfirmationData({
          type: 'deleteAll',
          data: null
        });
        setShowVoiceConfirmation(true);
        return;
      }
      
      // Try to find transaction by amount and description
      const amountMatch = transcript.match(/₹?(\d+(?:,\d+)*(?:\.\d+)?)/);
      const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;
      
      if (amount) {
        // Find transaction by amount and partial description match
        const matchingTransaction = transactions.find(transaction => {
          const amountMatch = Math.abs(transaction.amount - amount) < 1; // Allow small difference for floating point
          const descriptionMatch = transcript.toLowerCase().includes(transaction.description.toLowerCase()) ||
                                 transaction.description.toLowerCase().includes(transcript.toLowerCase());
          return amountMatch && descriptionMatch;
        });
        
        if (matchingTransaction) {
          setVoiceConfirmationData({
            type: 'delete',
            transactionId: matchingTransaction._id,
            data: matchingTransaction
          });
          setShowVoiceConfirmation(true);
          return;
        }
      }
      
      // If no specific transaction found, show all transactions for selection
      if (transactions.length > 0) {
        setVoiceConfirmationData({
          type: 'delete',
          transactionId: null,
          data: null,
          showTransactionList: true
        });
        setShowVoiceConfirmation(true);
        return;
      }
      
      alert('No transactions found to delete.');
      return;
    }
    
    // Enhanced category mapping for add commands
    const categoryMap = {
      'groceries': 'Groceries',
      'food': 'Food',
      'restaurant': 'Food',
      'transport': 'Transport',
      'uber': 'Transport',
      'ola': 'Transport',
      'petrol': 'Transport',
      'fuel': 'Transport',
      'entertainment': 'Entertainment',
      'movie': 'Entertainment',
      'shopping': 'Shopping',
      'amazon': 'Shopping',
      'flipkart': 'Shopping',
      'bills': 'Bills',
      'electricity': 'Bills',
      'rent': 'Bills',
      'medical': 'Medical',
      'health': 'Medical',
      'education': 'Education',
      'books': 'Education',
      'income': 'Income',
      'salary': 'Income',
      'freelance': 'Income'
    };

    // Extract amount
    const amountMatch = transcript.match(/₹?(\d+(?:,\d+)*(?:\.\d+)?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;

    // Extract category
    let category = 'Others';
    for (const [keyword, mappedCategory] of Object.entries(categoryMap)) {
      if (transcript.includes(keyword)) {
        category = mappedCategory;
        break;
      }
    }

    // Determine type
    const type = transcript.includes('income') || transcript.includes('salary') || transcript.includes('freelance') ? 'income' : 'expense';

    // Extract description
    let description = transcript;
    if (amountMatch) {
      description = description.replace(amountMatch[0], '').trim();
    }
    description = description.replace(/for|add|log|record|expense|income/g, '').trim();

    if (amount && description) {
      setVoiceConfirmationData({
        type: 'add',
        data: {
          type,
          amount,
          category,
          description: description.charAt(0).toUpperCase() + description.slice(1),
          date: new Date().toISOString().split('T')[0]
        }
      });
      setShowVoiceConfirmation(true);
    } else {
      alert('Could not understand the voice command. Please try again.');
    }
  };

  const confirmVoiceAction = async () => {
    if (voiceConfirmationData?.type === 'add') {
      try {
        await transactionService.addTransaction(voiceConfirmationData.data);
        await fetchTransactions();
        setShowVoiceConfirmation(false);
        setVoiceConfirmationData(null);
      } catch (error) {
        console.error('Error adding voice transaction:', error);
        alert('Failed to add transaction');
      }
    } else if (voiceConfirmationData?.type === 'delete') {
      try {
        console.log('Attempting to delete transaction:', voiceConfirmationData.transactionId);
        if (!voiceConfirmationData.transactionId) {
          throw new Error('No transaction ID provided');
        }
        await transactionService.deleteTransaction(voiceConfirmationData.transactionId);
        await fetchTransactions();
        setShowVoiceConfirmation(false);
        setVoiceConfirmationData(null);
      } catch (error) {
        console.error('Error deleting voice transaction:', error);
        alert(`Failed to delete transaction: ${error.message}`);
      }
    } else if (voiceConfirmationData?.type === 'deleteAll') {
      try {
        console.log('Attempting to delete all transactions via voice command');
        await handleDeleteAll();
        setShowVoiceConfirmation(false);
        setVoiceConfirmationData(null);
      } catch (error) {
        console.error('Error deleting all transactions via voice:', error);
        alert(`Failed to delete all transactions: ${error.message}`);
      }
    }
  };

  const { totalIncome, totalExpenses, netBalance } = updateFinancialSummary();

  // Receipt scanning functions
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size too large. Please select an image smaller than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptImage(e.target.result);
        scanReceipt(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // Create a file input and trigger camera
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'camera';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file');
          return;
        }
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert('File size too large. Please select an image smaller than 10MB');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          setReceiptImage(e.target.result);
          scanReceipt(file);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const scanReceipt = async (file) => {
    setIsScanning(true);
    try {
      console.log('Starting receipt scan...');
      
      // Use OCR service to scan receipt
      const result = await ocrService.scanReceipt(file);
      
      if (result.success) {
        console.log('Receipt scanned successfully:', result.data);
        
        // Validate the parsed data
        const validation = await ocrService.validateReceiptData(result.data);
        
        // Show warnings if any
        if (validation.warnings && validation.warnings.length > 0) {
          console.warn('Receipt validation warnings:', validation.warnings);
          setReceiptValidationWarnings(validation.warnings);
        } else {
          setReceiptValidationWarnings([]);
        }
        
        // Show errors if any
        if (!validation.isValid) {
          console.error('Receipt validation errors:', validation.errors);
          alert(`Receipt scan failed:\n\n${validation.errors.join('\n')}\n\nPlease try with a clearer image.`);
          setIsScanning(false);
          return;
        }
        
        // Enhance the data with additional information
        const enhancedData = await ocrService.enhanceReceiptData(result.data);
        
        setParsedReceipt(enhancedData);
        setShowReceiptModal(true);
      } else {
        throw new Error('Failed to scan receipt');
      }
    } catch (error) {
      console.error('Error scanning receipt:', error);
      alert('Failed to scan receipt. Please try again with a clearer image.');
    } finally {
      setIsScanning(false);
    }
  };

  const addReceiptTransaction = async () => {
    if (!parsedReceipt) {
      console.error('No parsed receipt data available');
      alert('No receipt data to add. Please scan a receipt first.');
      return;
    }

    try {
      // Validate parsed receipt data
      if (!parsedReceipt.total || parsedReceipt.total <= 0) {
        console.error('Invalid total amount:', parsedReceipt.total);
        alert('Invalid receipt total amount. Please try scanning again.');
        return;
      }

      if (!parsedReceipt.vendor) {
        console.error('Missing vendor information');
        alert('Vendor information is missing. Please try scanning again.');
        return;
      }

      // Validate and fix the date
      let transactionDate = parsedReceipt.date;
      if (!transactionDate || transactionDate === 'Invalid Date') {
        console.log('Invalid date detected, using current date');
        transactionDate = new Date().toISOString().split('T')[0];
      } else {
        // Validate the date
        const validateDate = new Date(transactionDate);
        if (isNaN(validateDate.getTime())) {
          console.log('Invalid date format, using current date');
          transactionDate = new Date().toISOString().split('T')[0];
        }
      }

      const transactionData = {
        type: 'expense',
        amount: Number(parsedReceipt.total), // Ensure it's a number
        category: parsedReceipt.category || 'Shopping',
        description: parsedReceipt.description || `Receipt from ${parsedReceipt.vendor}`,
        date: transactionDate
      };

      console.log('Adding receipt transaction:', transactionData);
      
      // Check authentication before proceeding
      const token = authService.getToken();
      if (!token) {
        console.error('No authentication token found');
        alert('Please log in to add transactions.');
        return;
      }

      const result = await transactionService.addTransaction(transactionData);
      console.log('Transaction added successfully:', result);
      
      await fetchTransactions();
      
      setShowReceiptModal(false);
      setReceiptImage(null);
      setParsedReceipt(null);
      setReceiptValidationWarnings([]);
      
      alert('Transaction added successfully from receipt!');
    } catch (error) {
      console.error('Error adding receipt transaction:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to add transaction from receipt';
      
      if (error.message.includes('authentication')) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('validation')) {
        errorMessage = 'Invalid transaction data. Please try scanning again.';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainDashboardNavbar />

      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
          <p className="text-gray-600 mb-4">Track all your daily expenses easily</p>
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Add New Transaction
            </button>
            <button 
              onClick={() => {
                const token = authService.getToken();
                console.log('Current token:', token ? token.substring(0, 50) + '...' : 'None');
                alert(`Token status: ${token ? 'Present' : 'Missing'}`);
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Debug Auth
            </button>
            <button 
              onClick={() => {
                if (transactions.length === 0) {
                  alert('No transactions to delete');
                  return;
                }
                setShowDeleteAllConfirmation(true);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Delete All Transactions
            </button>
          </div>
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

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={expenseForm.type}
                  onChange={(e) => setExpenseForm({...expenseForm, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-black"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500  bg-transparent text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-black"
                >
                  <option value="">Select category</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Medical">Medical</option>
                  <option value="Education">Education</option>
                  <option value="Income">Income</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-black"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Add a note..."
                  rows="3"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-black"
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Save Transaction
              </button>
            </form>
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
              {isScanning ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Camera className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-blue-600 font-medium">Scanning receipt...</p>
                  <div className="text-sm text-gray-500">Processing image and extracting data</div>
                </div>
              ) : receiptImage ? (
                <div className="space-y-4">
                  <img 
                    src={receiptImage} 
                    alt="Receipt" 
                    className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                  />
                  <p className="text-green-600 font-medium">Receipt uploaded successfully!</p>
                  <button 
                    onClick={() => {
                      setReceiptImage(null);
                      setParsedReceipt(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Upload another receipt
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">Upload or snap a picture of your receipt</p>
                  <div className="flex space-x-3 justify-center">
                    <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      Upload Receipt
                    </label>
                    <button 
                      onClick={handleCameraCapture}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Take Photo
                    </button>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-blue-800 text-xs font-medium mb-1">📸 Tips for better scanning:</div>
                    <ul className="text-blue-700 text-xs space-y-1">
                      <li>• Ensure good lighting</li>
                      <li>• Keep receipt flat and clear</li>
                      <li>• Include all text and numbers</li>
                      <li>• Avoid shadows and glare</li>
                    </ul>
                  </div>
                </>
              )}
            </div>

            {parsedReceipt && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Parsed Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Vendor:</span>
                    <span className="font-medium text-green-900">{parsedReceipt.vendor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Date:</span>
                    <span className="font-medium text-green-900">{new Date(parsedReceipt.date).toLocaleDateString()}</span>
                  </div>
                  {parsedReceipt.receiptNumber && (
                    <div className="flex justify-between">
                      <span className="text-green-700">Receipt #:</span>
                      <span className="font-medium text-green-900">{parsedReceipt.receiptNumber}</span>
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="text-green-700 font-medium mb-2">Itemized Breakdown:</div>
                    {parsedReceipt.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-xs mb-1">
                        <div className="flex-1">
                          <span className="text-green-600 font-medium">{item.name}</span>
                          {item.quantity > 1 && (
                            <span className="text-green-500 ml-1">(x{item.quantity})</span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-green-600">₹{item.unitPrice}</div>
                          <div className="text-green-700 font-medium">₹{item.amount}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Subtotal:</span>
                      <span className="font-medium text-green-900">₹{parsedReceipt.subtotal?.toLocaleString() || parsedReceipt.total.toLocaleString()}</span>
                    </div>
                    {parsedReceipt.tax && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">Tax:</span>
                        <span className="font-medium text-green-900">₹{parsedReceipt.tax.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold mt-1 pt-1 border-t border-green-200">
                      <span className="text-green-700">Total:</span>
                      <span className="text-green-900">₹{parsedReceipt.total.toLocaleString()}</span>
                    </div>
                  </div>
                  {parsedReceipt.paymentMethod && (
                    <div className="flex justify-between text-xs mt-2">
                      <span className="text-green-600">Payment:</span>
                      <span className="text-green-600">{parsedReceipt.paymentMethod}</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={addReceiptTransaction}
                  className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add to Transactions
                </button>
              </div>
            )}
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 text-black"></div>
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
                onClick={startVoiceRecording}
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
                  <li>• "Delete ₹500 groceries transaction"</li>
                  <li>• "Remove ₹2000 restaurant expense"</li>
                  <li>• "Cancel ₹1000 transport expense"</li>
                  <li>• "Delete all transactions"</li>
                  <li>• "Clear all expenses"</li>
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-transparent text-black"
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
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">Loading transactions...</td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">No transactions found</td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                    <td className="py-3 px-4 text-gray-900">{transaction.description}</td>
                    <td className="py-3 px-4 text-gray-600">{transaction.category}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        ₹{transaction.amount.toLocaleString()}
                      </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                          <Edit2 className="w-4 h-4" />
                        </button>
                          <button 
                            onClick={() => handleDelete(transaction._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
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
              <div className="text-2xl font-bold text-gray-900">₹{totalIncome.toLocaleString()}</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-600">Total Expenses</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Net Balance</span>
              </div>
              <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{netBalance.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Spending Categories Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Categories</h3>
            
            {categoryData.length > 0 ? (
              <>
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
                      <span className="text-sm font-medium text-gray-900">₹{category.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No expense data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voice Confirmation Modal */}
      {showVoiceConfirmation && voiceConfirmationData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {voiceConfirmationData.type === 'delete' ? 'Confirm Delete' : 'Confirm Voice Command'}
              </h3>
              <button
                onClick={() => setShowVoiceConfirmation(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mic className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-blue-900">Voice Command Detected</span>
                </div>
                
                {voiceConfirmationData.type === 'add' && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                        voiceConfirmationData.data.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {voiceConfirmationData.data.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-gray-900">₹{voiceConfirmationData.data.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-900">{voiceConfirmationData.data.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-medium text-gray-900">{voiceConfirmationData.data.description}</span>
                    </div>
                  </div>
                )}
                
                {voiceConfirmationData.type === 'delete' && voiceConfirmationData.data && (
                  <div className="space-y-2 text-sm">
                    <div className="text-red-600 font-medium mb-2">Delete Transaction:</div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-medium text-gray-900">{voiceConfirmationData.data.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-gray-900">₹{voiceConfirmationData.data.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-900">{voiceConfirmationData.data.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-900">{new Date(voiceConfirmationData.data.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
                
                {voiceConfirmationData.type === 'delete' && voiceConfirmationData.showTransactionList && (
                  <div className="space-y-2 text-sm">
                    <div className="text-red-600 font-medium mb-2">Select Transaction to Delete:</div>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {transactions.slice(0, 5).map((transaction) => (
                        <div 
                          key={transaction._id}
                          onClick={() => {
                            setVoiceConfirmationData({
                              ...voiceConfirmationData,
                              transactionId: transaction._id,
                              data: transaction,
                              showTransactionList: false
                            });
                          }}
                          className="p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">{transaction.description}</span>
                            <span className="font-semibold text-gray-900">₹{transaction.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{transaction.category}</span>
                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {voiceConfirmationData.type === 'deleteAll' && (
                  <div className="space-y-2 text-sm">
                    <div className="text-red-600 font-medium mb-2">Delete All Transactions:</div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 text-xs font-bold">!</span>
                        </div>
                        <span className="font-medium text-red-800">Warning</span>
                      </div>
                      <p className="text-red-700 text-sm">
                        This will permanently delete ALL {transactions.length} transactions. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowVoiceConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmVoiceAction}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  voiceConfirmationData.type === 'delete' 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {voiceConfirmationData.type === 'delete' ? 'Delete' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Confirmation Modal */}
      {showReceiptModal && parsedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Receipt Transaction</h3>
              <button
                onClick={() => {
                  setShowReceiptModal(false);
                  setReceiptValidationWarnings([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              {/* Validation Warnings */}
              {receiptValidationWarnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-xs font-bold">!</span>
                    </div>
                    <span className="font-medium text-yellow-800">Validation Warnings</span>
                  </div>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    {receiptValidationWarnings.map((warning, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-yellow-600">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Camera className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium text-green-900">Receipt Scanned Successfully</span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vendor:</span>
                    <span className="font-medium text-gray-900">{parsedReceipt.vendor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">
                      {parsedReceipt.date && parsedReceipt.date !== 'Invalid Date' 
                        ? new Date(parsedReceipt.date).toLocaleDateString()
                        : 'Current Date (date not detected)'
                      }
                    </span>
                  </div>
                  {parsedReceipt.receiptNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Receipt #:</span>
                      <span className="font-medium text-gray-900">{parsedReceipt.receiptNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-gray-900">{parsedReceipt.category || 'Shopping'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description:</span>
                    <span className="font-medium text-gray-900">{parsedReceipt.description || `Receipt from ${parsedReceipt.vendor}`}</span>
                  </div>
                  {parsedReceipt.confidence && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confidence:</span>
                      <span className="font-medium text-gray-900">{(parsedReceipt.confidence * 100).toFixed(1)}%</span>
                    </div>
                  )}
                  {parsedReceipt.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment:</span>
                      <span className="font-medium text-gray-900">{parsedReceipt.paymentMethod}</span>
                    </div>
                  )}
                </div>
                
                {/* Price Breakdown */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-700 font-medium mb-2">Price Breakdown:</div>
                  {parsedReceipt.items && parsedReceipt.items.length > 0 && (
                    <div className="space-y-1 text-xs">
                      {parsedReceipt.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-600">
                            {item.name}
                            {item.quantity > 1 && ` (x${item.quantity})`}
                          </span>
                          <span className="text-gray-700 font-medium">₹{item.amount}</span>
                        </div>
                      ))}
                      {parsedReceipt.items.length > 3 && (
                        <div className="text-gray-500 text-xs">+{parsedReceipt.items.length - 3} more items</div>
                      )}
                    </div>
                  )}
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium text-gray-900">₹{parsedReceipt.subtotal?.toLocaleString() || parsedReceipt.total.toLocaleString()}</span>
                    </div>
                    {parsedReceipt.tax && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax:</span>
                        <span className="font-medium text-gray-900">₹{parsedReceipt.tax.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold mt-1">
                      <span className="text-gray-700">Total:</span>
                      <span className="text-gray-900">₹{parsedReceipt.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowReceiptModal(false);
                  setReceiptValidationWarnings([]);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addReceiptTransaction}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Modal */}
      {showDeleteAllConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete All Transactions</h3>
              <button
                onClick={() => setShowDeleteAllConfirmation(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xs font-bold">!</span>
                  </div>
                  <span className="font-medium text-red-800">Warning</span>
                </div>
                <p className="text-red-700 text-sm">
                  This will permanently delete ALL {transactions.length} transactions. This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteAllConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowDeleteAllConfirmation(false);
                  await handleDeleteAll();
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

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