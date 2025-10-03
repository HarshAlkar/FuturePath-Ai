import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Table, Image, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ExportData = ({ darkMode, goldPrices = [], historicalData = [], isOpen, onClose }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportType, setExportType] = useState('current');
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    { value: 'csv', label: 'CSV', icon: Table, description: 'Comma-separated values' },
    { value: 'json', label: 'JSON', icon: FileText, description: 'JavaScript Object Notation' },
    { value: 'xlsx', label: 'Excel', icon: Table, description: 'Microsoft Excel format' },
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Portable Document Format' }
  ];

  const exportTypes = [
    { value: 'current', label: 'Current Prices', description: 'Latest commodity prices' },
    { value: 'historical', label: 'Historical Data', description: 'Price history over time' },
    { value: 'both', label: 'Complete Dataset', description: 'All available data' }
  ];

  const generateCSV = (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    downloadFile(csvContent, filename, 'text/csv');
  };

  const generateJSON = (data, filename) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, filename, 'application/json');
  };

  const generateExcel = async (data, filename) => {
    // Mock Excel generation - in real app, use libraries like xlsx
    const csvContent = generateCSVContent(data);
    downloadFile(csvContent, filename.replace('.xlsx', '.csv'), 'text/csv');
    toast.info('Excel export converted to CSV format');
  };

  const generatePDF = async (data, filename) => {
    // Mock PDF generation - in real app, use libraries like jsPDF
    const textContent = `Gold Market Data Export\n\nGenerated: ${new Date().toLocaleString()}\n\n${JSON.stringify(data, null, 2)}`;
    downloadFile(textContent, filename.replace('.pdf', '.txt'), 'text/plain');
    toast.info('PDF export converted to text format');
  };

  const generateCSVContent = (data) => {
    if (!data || data.length === 0) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let dataToExport = [];
      let filename = '';

      switch (exportType) {
        case 'current':
          dataToExport = goldPrices.map(price => ({
            symbol: price.symbol,
            name: price.name,
            price: price.price,
            currency: price.currency,
            change24h: price.change24h,
            changePercent24h: price.changePercent24h,
            high24h: price.high24h,
            low24h: price.low24h,
            volume: price.volume,
            timestamp: price.timestamp
          }));
          filename = `gold_prices_${new Date().toISOString().split('T')[0]}`;
          break;
          
        case 'historical':
          dataToExport = historicalData.map(data => ({
            symbol: data.symbol,
            date: data.date,
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close,
            volume: data.volume
          }));
          filename = `gold_historical_${new Date().toISOString().split('T')[0]}`;
          break;
          
        case 'both':
          dataToExport = {
            currentPrices: goldPrices,
            historicalData: historicalData,
            exportDate: new Date().toISOString()
          };
          filename = `gold_complete_data_${new Date().toISOString().split('T')[0]}`;
          break;
      }

      switch (exportFormat) {
        case 'csv':
          if (exportType === 'both') {
            generateCSV(goldPrices, `${filename}_prices.csv`);
            generateCSV(historicalData, `${filename}_historical.csv`);
          } else {
            generateCSV(dataToExport, `${filename}.csv`);
          }
          break;
          
        case 'json':
          generateJSON(dataToExport, `${filename}.json`);
          break;
          
        case 'xlsx':
          await generateExcel(dataToExport, `${filename}.xlsx`);
          break;
          
        case 'pdf':
          await generatePDF(dataToExport, `${filename}.pdf`);
          break;
      }

      toast.success('Data exported successfully!');
      onClose();
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
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
        className={`w-full max-w-lg rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <Download className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Export Data
            </h2>
          </div>
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Type Selection */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              What to Export
            </label>
            <div className="space-y-2">
              {exportTypes.map((type) => (
                <motion.label
                  key={type.value}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    exportType === type.value
                      ? darkMode
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-blue-500 bg-blue-50'
                      : darkMode
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="exportType"
                    value={type.value}
                    checked={exportType === type.value}
                    onChange={(e) => setExportType(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {type.label}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {type.description}
                    </div>
                  </div>
                  {exportType === type.value && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </motion.label>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {exportFormats.map((format) => {
                const Icon = format.icon;
                return (
                  <motion.button
                    key={format.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setExportFormat(format.value)}
                    className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                      exportFormat === format.value
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : darkMode
                        ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">{format.label}</div>
                      <div className={`text-xs ${
                        exportFormat === format.value ? 'text-blue-100' : 
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {format.description}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            disabled={isExporting}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
              isExporting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isExporting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExportData;
