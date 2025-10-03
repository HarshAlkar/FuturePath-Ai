import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';

const GoldChart = ({ 
  data = [], 
  symbol = 'XAU', 
  timeRange = '1D', 
  darkMode = false,
  height = 400 
}) => {
  const chartContainerRef = useRef();
  const chart = useRef();
  const candlestickSeries = useRef();
  const volumeSeries = useRef();
  const [chartType, setChartType] = useState('candlestick');
  const [indicators, setIndicators] = useState({
    sma: false,
    ema: false,
    rsi: false,
    macd: false
  });

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Chart configuration
    const chartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: darkMode ? '#1f2937' : '#ffffff' },
        textColor: darkMode ? '#e5e7eb' : '#374151',
      },
      grid: {
        vertLines: { color: darkMode ? '#374151' : '#f3f4f6' },
        horzLines: { color: darkMode ? '#374151' : '#f3f4f6' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: darkMode ? '#4b5563' : '#d1d5db',
      },
      timeScale: {
        borderColor: darkMode ? '#4b5563' : '#d1d5db',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    };

    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      ...chartOptions,
    });

    // Create candlestick series
    candlestickSeries.current = chart.current.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#10b981',
      wickDownColor: '#ef4444',
      wickUpColor: '#10b981',
    });

    // Create volume series
    volumeSeries.current = chart.current.addHistogramSeries({
      color: '#6b7280',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // Handle resize
    const handleResize = () => {
      if (chart.current && chartContainerRef.current) {
        chart.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chart.current) {
        chart.current.remove();
      }
    };
  }, [darkMode, height]);

  useEffect(() => {
    if (!candlestickSeries.current || !volumeSeries.current || !data.length) return;

    // Process data for chart
    const processedData = data.map(item => ({
      time: new Date(item.date).getTime() / 1000,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    const volumeData = data.map(item => ({
      time: new Date(item.date).getTime() / 1000,
      value: item.volume || 0,
      color: item.close > item.open ? '#10b981' : '#ef4444',
    }));

    candlestickSeries.current.setData(processedData);
    volumeSeries.current.setData(volumeData);

    // Add technical indicators if enabled
    if (indicators.sma) {
      addSMA(processedData);
    }
    if (indicators.ema) {
      addEMA(processedData);
    }

    // Fit content
    chart.current.timeScale().fitContent();
  }, [data, indicators]);

  const addSMA = (data, period = 20) => {
    if (data.length < period) return;

    const smaData = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, item) => acc + item.close, 0);
      smaData.push({
        time: data[i].time,
        value: sum / period,
      });
    }

    const smaSeries = chart.current.addLineSeries({
      color: '#3b82f6',
      lineWidth: 2,
      title: `SMA(${period})`,
    });
    smaSeries.setData(smaData);
  };

  const addEMA = (data, period = 20) => {
    if (data.length < period) return;

    const emaData = [];
    const multiplier = 2 / (period + 1);
    let ema = data.slice(0, period).reduce((acc, item) => acc + item.close, 0) / period;

    emaData.push({ time: data[period - 1].time, value: ema });

    for (let i = period; i < data.length; i++) {
      ema = (data[i].close - ema) * multiplier + ema;
      emaData.push({ time: data[i].time, value: ema });
    }

    const emaSeries = chart.current.addLineSeries({
      color: '#f59e0b',
      lineWidth: 2,
      title: `EMA(${period})`,
    });
    emaSeries.setData(emaData);
  };

  const toggleIndicator = (indicator) => {
    setIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };

  const chartTypeButtons = [
    { type: 'candlestick', icon: BarChart3, label: 'Candlestick' },
    { type: 'line', icon: TrendingUp, label: 'Line' },
    { type: 'area', icon: Activity, label: 'Area' },
  ];

  const indicatorButtons = [
    { key: 'sma', label: 'SMA(20)' },
    { key: 'ema', label: 'EMA(20)' },
    { key: 'rsi', label: 'RSI' },
    { key: 'macd', label: 'MACD' },
  ];

  return (
    <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      {/* Chart Controls */}
      <div className={`flex items-center justify-between p-4 border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center space-x-4">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {symbol} Price Chart
          </h3>
          <div className="flex items-center space-x-1">
            {chartTypeButtons.map(({ type, icon: Icon, label }) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setChartType(type)}
                className={`p-2 rounded-lg transition-colors ${
                  chartType === type
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Indicators:
          </span>
          {indicatorButtons.map(({ key, label }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleIndicator(key)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                indicators[key]
                  ? 'bg-blue-500 text-white'
                  : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <div ref={chartContainerRef} className="w-full" />
        
        {data.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Loading Chart Data...</p>
              <p className="text-sm">Real-time price data will appear here</p>
            </div>
          </div>
        )}
      </div>

      {/* Chart Stats */}
      {data.length > 0 && (
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ${data[data.length - 1]?.close?.toFixed(2) || '0.00'}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Current Price
              </div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ${Math.max(...data.map(d => d.high)).toFixed(2)}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                24h High
              </div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ${Math.min(...data.map(d => d.low)).toFixed(2)}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                24h Low
              </div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {data.reduce((sum, d) => sum + (d.volume || 0), 0).toLocaleString()}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Volume
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoldChart;
