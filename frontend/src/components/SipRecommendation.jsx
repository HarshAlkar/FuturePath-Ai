import React, { useState, useEffect } from 'react';
import { TrendingUp, Calculator, Target, AlertCircle, CheckCircle, Info, BarChart3, PieChart, DollarSign } from 'lucide-react';
import sipService from '../services/sipService';

const SipRecommendation = ({ userProfile, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [calculation, setCalculation] = useState(null);
  const [formData, setFormData] = useState({
    annualIncome: userProfile?.monthlyIncome * 12 || 900000,
    horizonYears: 10,
    riskLevel: 'moderate',
    monthlySip: 0,
    expectedReturn: 12 // Default for calculations
  });

  useEffect(() => {
    // Auto-calculate suggested SIP amount
    const suggestedSip = sipService.calculateSuggestedSip(formData.annualIncome, formData.riskLevel);
    setFormData(prev => ({ ...prev, monthlySip: suggestedSip }));
  }, [formData.annualIncome, formData.riskLevel]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await sipService.getRecommendations(
        formData.annualIncome,
        formData.horizonYears,
        formData.riskLevel
      );
      
      if (response.success) {
        setRecommendations(response.recommendation);
        console.log('SIP Recommendations:', response.recommendation);
      } else {
        setError('Failed to get recommendations');
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateSip = async () => {
    setLoading(true);
    setError(null);
    
    // Validate required fields
    if (!formData.monthlySip || formData.monthlySip <= 0) {
      setError('Please enter a valid monthly SIP amount');
      setLoading(false);
      return;
    }
    
    try {
      const response = await sipService.calculateSip(
        formData.monthlySip,
        formData.horizonYears,
        formData.expectedReturn
      );
      
      if (response.success) {
        setCalculation(response.calculation);
      } else {
        setError('Failed to calculate SIP returns');
      }
    } catch (error) {
      console.error('Error calculating SIP:', error);
      setError('Failed to calculate SIP returns. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const riskInfo = sipService.getRiskDescription(formData.riskLevel);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">SIP Investment Recommendations</h2>
                <p className="text-gray-600">Get personalized mutual fund recommendations</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Input Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Input Form */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Investment Profile
                </h3>
                
                <div className="space-y-4">
                  {/* Annual Income */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Income (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.annualIncome}
                      onChange={(e) => handleInputChange('annualIncome', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="900000"
                    />
                  </div>

                  {/* Investment Horizon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Horizon (Years)
                    </label>
                    <select
                      value={formData.horizonYears}
                      onChange={(e) => handleInputChange('horizonYears', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={5}>5 Years</option>
                      <option value={10}>10 Years</option>
                      <option value={15}>15 Years</option>
                      <option value={20}>20 Years</option>
                      <option value={25}>25 Years</option>
                      <option value={30}>30 Years</option>
                    </select>
                  </div>

                  {/* Risk Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Risk Tolerance
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['low', 'moderate', 'aggressive'].map((risk) => (
                        <button
                          key={risk}
                          onClick={() => handleInputChange('riskLevel', risk)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            formData.riskLevel === risk
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-sm font-medium capitalize">{risk}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {risk === 'low' ? 'Conservative' : 
                             risk === 'moderate' ? 'Balanced' : 'Growth'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Monthly SIP Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly SIP Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.monthlySip}
                      onChange={(e) => handleInputChange('monthlySip', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="11250"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Suggested: ₹{sipService.calculateSuggestedSip(formData.annualIncome, formData.riskLevel).toLocaleString()}
                    </p>
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleGetRecommendations}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Target className="w-4 h-4 mr-2" />
                    )}
                    Get Recommendations
                  </button>
                  
                  <button
                    onClick={handleCalculateSip}
                    disabled={loading || !formData.monthlySip}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Returns
                  </button>
                </div>
              </div>

              {/* Risk Level Info */}
              <div className={`${riskInfo.bgColor} rounded-xl p-4 border`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-4 h-4" />
                  <h4 className={`font-semibold ${riskInfo.color}`}>{riskInfo.title}</h4>
                </div>
                <p className="text-sm text-gray-700">{riskInfo.description}</p>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800">{error}</span>
                  </div>
                </div>
              )}

              {/* AI Recommendations */}
              {recommendations && recommendations.aiRecommendation && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-5 h-5 mr-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">AI</span>
                    </div>
                    AI-Powered Recommendations
                  </h3>
                  
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                      {recommendations.aiRecommendation}
                    </div>
                  </div>
                </div>
              )}

              {/* Fund Recommendations */}
              {recommendations && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Recommended Mutual Funds
                  </h3>
                  
                  <div className="space-y-4">
                    {recommendations.fundRecommendations && recommendations.fundRecommendations.recommendations ? (
                      recommendations.fundRecommendations.recommendations.map((fund, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-600">{fund.rank}</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{fund.schemeName}</h4>
                                <p className="text-sm text-gray-600">Code: {fund.schemeCode}</p>
                              </div>
                            </div>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {fund.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{fund.reason}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>No specific fund recommendations available.</p>
                        <p className="text-sm">Check the AI recommendations above for detailed analysis.</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Suggested Monthly SIP:</strong> ₹{recommendations.monthlySip.toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Based on {recommendations.riskLevel} risk tolerance and {recommendations.horizonYears}-year horizon
                    </p>
                  </div>
                </div>
              )}

              {/* SIP Calculation Results */}
              {calculation && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    SIP Returns Projection
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{calculation.futureValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Future Value</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        ₹{calculation.totalInvested.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Invested</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Expected Annual Return</span>
                      <span className="font-semibold text-purple-600">
                        {calculation.expectedReturn}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Gains</span>
                      <span className="font-semibold text-green-600">
                        ₹{calculation.totalGains.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Return Percentage</span>
                      <span className="font-semibold text-blue-600">
                        {calculation.returnPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Yearly Projections Chart */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Year-wise Growth</h4>
                    <div className="space-y-2">
                      {calculation.yearlyProjections.slice(0, 5).map((projection, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Year {projection.year}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-500">₹{projection.invested.toLocaleString()}</span>
                            <span className="text-gray-400">→</span>
                            <span className="font-medium text-gray-900">₹{projection.value.toLocaleString()}</span>
                            <span className="text-green-600 font-medium">
                              +{projection.returnPercentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SipRecommendation;
