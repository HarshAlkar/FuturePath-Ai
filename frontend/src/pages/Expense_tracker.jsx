import React, { useState, useEffect, useMemo } from 'react';
import { Bell, User, Edit, Calendar, Camera, Mic, Search, Filter, TrendingUp, TrendingDown, Clock, Edit2, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import MainDashboardNavbar from './main_dashboard_navbar';

// USE REAL API (persistent, uses MongoDB)
import transactionService from '../services/transactionService';

const Expense_tracker = () => {
  const [smsSync, setSmsSync] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  
  const [transactions, setTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: 'expense',
  });

  // Fetch transactions and category data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const txs = await transactionService.getTransactions();
        setTransactions(txs);
        updateCategoryData(txs);
        updateFinancialSummary(txs);
      } catch (err) {
        // addToast('Failed to fetch transactions', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper: Update category data for pie chart
  const updateCategoryData = (txs) => {
    const categories = ['Groceries', 'Transport', 'Entertainment', 'Bills', 'Others'];
    const total = txs.length;
    const data = categories.map(cat => {
      const count = txs.filter(t => t.category === cat).length;
      return {
        name: cat,
        value: total ? Math.round((count / total) * 100) : 0,
        color:
          cat === 'Groceries' ? '#3b82f6' :
          cat === 'Transport' ? '#10b981' :
          cat === 'Entertainment' ? '#f59e0b' :
          cat === 'Bills' ? '#ef4444' :
          '#8b5cf6',
      };
    });
    setCategoryData(data);
  };

  // Helper: Update financial summary (implement as needed)
  const updateFinancialSummary = (txs) => {
    // Implement logic to update summary cards if needed
  };

  // Update all handlers to use transactionService
  const handleAddTransaction = async (form) => {
    setIsLoading(true);
    try {
      await transactionService.addTransaction(form);
      // Re-fetch all transactions after adding
      const txs = await transactionService.getTransactions();
      setTransactions(txs);
      updateCategoryData(txs);
      updateFinancialSummary(txs);
      // (Optional) show a success message here
    } catch (err) {
      // (Optional) show an error message here
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setExpenseForm({
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: transaction.date,
      description: transaction.title,
      type: transaction.type
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedTx = await transactionService.updateTransaction(selectedTransaction._id, expenseForm);
      setTransactions(prev => prev.map(t => t._id === selectedTransaction._id ? updatedTx : t));
      updateCategoryData(transactions.map(t => t._id === selectedTransaction._id ? updatedTx : t));
      updateFinancialSummary(transactions.map(t => t._id === selectedTransaction._id ? updatedTx : t));
      // addToast('Transaction updated!', 'success');
      setShowEditModal(false);
      setSelectedTransaction(null);
      setExpenseForm({ amount: '', category: '', date: new Date().toISOString().split('T')[0], description: '', type: 'expense' });
    } catch (err) {
      // addToast('Failed to update transaction', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (transactionId) => {
    setIsLoading(true);
    try {
      await transactionService.deleteTransaction(transactionId);
      const updated = transactions.filter(t => t._id !== transactionId);
      setTransactions(updated);
      updateCategoryData(updated);
      updateFinancialSummary(updated);
      // addToast('Transaction deleted!', 'success');
    } catch (err) {
      // addToast('Failed to delete transaction', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Voice recording simulation
  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // addToast('Voice recording started...', 'info');
      
      // Simulate different voice commands
      const voiceCommands = [
        { amount: '500', category: 'Groceries', description: 'Voice: Groceries expense' },
        { amount: '2000', category: 'Transport', description: 'Voice: Transport expense' },
        { amount: '1500', category: 'Entertainment', description: 'Voice: Entertainment expense' },
        { amount: '3000', category: 'Bills', description: 'Voice: Bills payment' },
        { amount: '1000', category: 'Others', description: 'Voice: Other expense' }
      ];
      
      const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
      
      // Simulate voice processing
      setTimeout(() => {
        setIsRecording(false);
        // addToast(`Voice processed: "Add ₹${randomCommand.amount} for ${randomCommand.category.toLowerCase()}"`, 'success');
        
        // Auto-fill quick add form with voice data
        // setQuickAddForm({
        //   amount: randomCommand.amount,
        //   category: randomCommand.category
        // });
        
        // Also update the main form for the modal
        setExpenseForm(prev => ({
          ...prev,
          amount: randomCommand.amount,
          category: randomCommand.category,
          description: randomCommand.description
        }));
        
        // Auto-submit the quick add after a short delay
        setTimeout(() => {
          handleQuickAdd();
        }, 1000);
        
      }, 3000);
    }
  };

  // Real voice input functionality
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [showVoiceConfirmation, setShowVoiceConfirmation] = useState(false);
  const [voiceConfirmationData, setVoiceConfirmationData] = useState(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        setIsRecording(true);
        // addToast('Listening... Speak now!', 'info');
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setVoiceText(transcript);
        // addToast(`Heard: "${transcript}"`, 'success');
        
        // Process the voice command
        processVoiceCommand(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsRecording(false);
        // addToast('Voice recognition error. Please try again.', 'error');
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      // addToast('Speech recognition not supported in this browser', 'error');
    }
  }, []);

  // Process voice command
  const processVoiceCommand = (command) => {
    // Check for delete commands first
    if (command.includes('delete') || command.includes('remove')) {
      if (command.includes('all') || command.includes('everything')) {
        // Delete all transactions
        setVoiceConfirmationData({
          action: 'deleteAll',
          description: 'Delete all transactions',
          type: 'delete'
        });
        setShowVoiceConfirmation(true);
        return;
      } else {
        // Delete specific transaction by amount
        const amountMatch = command.match(/(\d+)/);
        if (amountMatch) {
          const amount = amountMatch[1];
          const matchingTransaction = transactions.find(t => t.amount.toString() === amount);
          
          if (matchingTransaction) {
            setVoiceConfirmationData({
              action: 'deleteSpecific',
              transactionId: matchingTransaction._id,
              amount: amount,
              description: `Delete transaction of ₹${amount}`,
              type: 'delete'
            });
            setShowVoiceConfirmation(true);
            return;
          } else {
            // addToast(`No transaction found with amount ₹${amount}`, 'error');
            return;
          }
        } else {
          // addToast('Please specify an amount to delete, like "delete transaction 500"', 'error');
          return;
        }
      }
    }

    // Extract amount from command
    const amountMatch = command.match(/(\d+)/);
    if (!amountMatch) {
      // addToast('Could not detect amount. Please say something like "Add 500 for groceries"', 'error');
      return;
    }
    
    const amount = amountMatch[1];
    
    // Detect type (income or expense)
    let type = 'expense';
    if (
      command.includes('salary') ||
      command.includes('deposit') ||
      command.includes('received') ||
      command.includes('income') ||
      command.includes('credited') ||
      command.includes('bonus') ||
      command.includes('refund')
    ) {
      type = 'income';
    }
    
    // Extract category from command
    const categoryMap = [
      { keywords: ['grocery', 'groceries', 'food', 'vegetable', 'restaurant', 'zomato', 'swiggy', 'eat'], value: 'Groceries' },
      { keywords: ['transport', 'uber', 'taxi', 'fuel', 'bus', 'train', 'cab', 'ola', 'auto'], value: 'Transport' },
      { keywords: ['entertainment', 'movie', 'game', 'netflix', 'cinema', 'pvr', 'bookmyshow'], value: 'Entertainment' },
      { keywords: ['bill', 'electricity', 'water', 'gas', 'phone', 'internet', 'recharge', 'postpaid', 'prepaid'], value: 'Bills' },
      { keywords: ['shopping', 'clothes', 'apparel', 'mall', 'amazon', 'flipkart', 'purchase'], value: 'Shopping' },
      { keywords: ['health', 'medical', 'doctor', 'medicine', 'hospital', 'pharmacy'], value: 'Healthcare' },
      { keywords: ['salary', 'deposit', 'bonus', 'income', 'credited', 'pay'], value: 'Salary' },
      { keywords: ['other', 'misc'], value: 'Others' },
    ];
    let category = 'Others';
    const lowerCmd = command.toLowerCase();
    for (const entry of categoryMap) {
      if (entry.keywords.some(kw => lowerCmd.includes(kw))) {
        category = entry.value;
        break;
      }
    }
    
    // In processVoiceCommand, instead of calling handleAddTransaction directly, setVoiceConfirmationData with the parsed info and setShowVoiceConfirmation(true)
    setVoiceConfirmationData({
      action: 'add',
      amount,
      category,
      date: new Date().toISOString().split('T')[0],
      description: `Voice: ${command}`,
      type
    });
    setShowVoiceConfirmation(true);
  };

  // Confirm voice transaction
  const confirmVoiceTransaction = async () => {
    if (!voiceConfirmationData) return;
    
    try {
      if (voiceConfirmationData.action === 'deleteAll') {
        // Delete all transactions
        for (const transaction of transactions) {
          await transactionService.deleteTransaction(transaction._id);
        }
        setTransactions([]);
        updateFinancialSummary([]);
        updateCategoryData([]);
        // addToast('All transactions deleted successfully!', 'success');
      } else if (voiceConfirmationData.action === 'deleteSpecific') {
        // Delete specific transaction
        const response = await transactionService.deleteTransaction(voiceConfirmationData.transactionId);
        if (response.success) {
          const updatedTransactions = transactions.filter(t => t._id !== voiceConfirmationData.transactionId);
          setTransactions(updatedTransactions);
          updateFinancialSummary(updatedTransactions);
          updateCategoryData(updatedTransactions);
          // addToast(`Transaction of ₹${voiceConfirmationData.amount} deleted successfully!`, 'success');
        }
      } else {
        // Add new transaction
        const quickTransaction = {
          amount: parseFloat(voiceConfirmationData.amount),
          category: voiceConfirmationData.category,
          date: new Date().toISOString().split('T')[0],
          description: voiceConfirmationData.description,
          type: voiceConfirmationData.type
        };

        const response = await transactionService.addTransaction(quickTransaction);
        if (response.success) {
          const newTransaction = response.data;
          setTransactions(prev => [newTransaction, ...prev]);
          
          // Update financial summary with new transaction
          const updatedTransactions = [newTransaction, ...transactions];
          updateFinancialSummary(updatedTransactions);
          updateCategoryData(updatedTransactions);

          // addToast('Voice transaction added successfully!', 'success');
        }
      }
      
      // Reset voice confirmation
      setShowVoiceConfirmation(false);
      setVoiceConfirmationData(null);
      setVoiceText('');
    } catch (error) {
      // addToast('Failed to process voice command', 'error');
    }
  };

  // Cancel voice transaction
  const cancelVoiceTransaction = () => {
    setShowVoiceConfirmation(false);
    setVoiceConfirmationData(null);
    setVoiceText('');
    // addToast('Voice transaction cancelled', 'info');
  };

  // Start voice recording
  const startVoiceRecording = () => {
    if (recognition) {
      recognition.start();
    } else {
      // addToast('Voice recognition not available', 'error');
    }
  };

  // Stop voice recording
  const stopVoiceRecording = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0), [transactions]);
  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gray-50">
      <MainDashboardNavbar />

      {showVoiceConfirmation && voiceConfirmationData && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-200 relative animate-fade-in">
            <div className="flex items-center mb-6">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mr-4">
                <Mic className="w-7 h-7 text-blue-600" />
              </span>
              <h2 className="text-2xl font-bold text-blue-700">Voice {voiceConfirmationData.action === 'add' ? 'Transaction' : 'Action'}</h2>
            </div>
            <div className="mb-6 space-y-3 text-gray-800">
              {voiceConfirmationData.action === 'add' ? (
                <>
                  <div className="flex items-center"><span className="w-28 font-semibold">Type:</span> <span className="capitalize">{voiceConfirmationData.type}</span></div>
                  <div className="flex items-center"><span className="w-28 font-semibold">Amount:</span> <span className="text-green-600 font-bold">₹{voiceConfirmationData.amount}</span></div>
                  <div className="flex items-center"><span className="w-28 font-semibold">Category:</span> <span className="text-indigo-600 font-semibold">{voiceConfirmationData.category}</span></div>
                  <div className="flex items-center"><span className="w-28 font-semibold">Description:</span> <span>{voiceConfirmationData.description}</span></div>
                  <div className="flex items-center"><span className="w-28 font-semibold">Date:</span> <span>{voiceConfirmationData.date}</span></div>
                </>
              ) : (
                <div>{voiceConfirmationData.description}</div>
              )}
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="px-5 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 border border-gray-300 text-gray-700 font-medium transition"
                onClick={() => {
                  setShowVoiceConfirmation(false);
                  setVoiceConfirmationData(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm transition"
                onClick={async () => {
                  setShowVoiceConfirmation(false);
                  if (voiceConfirmationData.action === 'add') {
                    await handleAddTransaction(voiceConfirmationData);
                  } else if (voiceConfirmationData.action === 'deleteAll') {
                    for (const transaction of transactions) {
                      await transactionService.deleteTransaction(transaction._id);
                    }
                    const txs = await transactionService.getTransactions();
                    setTransactions(txs);
                    updateCategoryData(txs);
                    updateFinancialSummary(txs);
                  } else if (voiceConfirmationData.action === 'deleteSpecific') {
                    await transactionService.deleteTransaction(voiceConfirmationData.transactionId);
                    const txs = await transactionService.getTransactions();
                    setTransactions(txs);
                    updateCategoryData(txs);
                    updateFinancialSummary(txs);
                  }
                  setVoiceConfirmationData(null);
                }}
              >
                {voiceConfirmationData.action === 'add' ? 'Add' : 'Delete'}
              </button>
            </div>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
              onClick={() => {
                setShowVoiceConfirmation(false);
                setVoiceConfirmationData(null);
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

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

            {/* Replace the manual entry form with a controlled form: */}
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                // Frontend validation
                if (
                  !expenseForm.amount || isNaN(Number(expenseForm.amount)) || Number(expenseForm.amount) <= 0
                ) {
                  alert('Please enter a valid amount greater than 0.');
                  return;
                }
                if (!expenseForm.category || expenseForm.category === '' || expenseForm.category === 'Select category') {
                  alert('Please select a category.');
                  return;
                }
                if (!expenseForm.description || expenseForm.description.trim() === '') {
                  alert('Please enter a description.');
                  return;
                }
                await handleAddTransaction(expenseForm);
                setExpenseForm({
                  amount: '',
                  category: '',
                  date: new Date().toISOString().split('T')[0],
                  description: '',
                  type: 'expense',
                });
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={expenseForm.type}
                  onChange={e => setExpenseForm(f => ({ ...f, type: e.target.value }))}
                  required
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
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={expenseForm.amount}
                    onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={expenseForm.category}
                  onChange={e => setExpenseForm(f => ({ ...f, category: e.target.value }))}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Bills">Bills</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={expenseForm.date}
                    onChange={e => setExpenseForm(f => ({ ...f, date: e.target.value }))}
                    required
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
                  value={expenseForm.description}
                  onChange={e => setExpenseForm(f => ({ ...f, description: e.target.value }))}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Expense'}
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
                onClick={startVoiceRecording}
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                <Mic className="w-8 h-8 text-white" />
              </button>
              <p className="text-gray-600 text-sm mb-6">Tap to start speaking</p>
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
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">{transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : ''}</td>
                  <td className="py-3 px-4 text-gray-900">{transaction.description}</td>
                  <td className="py-3 px-4 text-gray-600">{transaction.category}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">₹{Number(transaction.amount).toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700" onClick={() => handleEdit(transaction)}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700" onClick={() => handleDelete(transaction._id)}>
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
            <div className="text-2xl font-bold text-gray-900">₹{totalIncome.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-sm text-gray-600">Total Expenses</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">₹{totalExpenses.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Net Balance</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">₹{netBalance.toLocaleString('en-IN')}</div>
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
}

export default Expense_tracker;
