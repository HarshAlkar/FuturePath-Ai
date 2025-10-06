import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PDFReportGenerator = ({ profileData, analysis, userInfo }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const generatePDFReport = async () => {
    setIsGenerating(true);
    
    try {
      // Create new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Set up fonts and colors
      doc.setFont('helvetica');
      
      // Header
      doc.setFillColor(59, 130, 246); // Blue background
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('FuturePath AI Financial Report', 20, 25);
      
      // Subtitle
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 35);
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      let yPosition = 60;
      
      // User Information Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Personal Information', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${userInfo?.name || 'User'}`, 20, yPosition);
      yPosition += 8;
      doc.text(`User Type: ${analysis?.userTypeTitle || 'General User'}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
      yPosition += 20;
      
      // Risk Profile Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Risk Profile Analysis', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Risk Level: ${analysis?.riskProfile || 'Moderate'}`, 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Risk Score: ${analysis?.riskScore || 50}/100`, 20, yPosition);
      yPosition += 8;
      doc.text(`Experience Level: ${analysis?.experience || 'Intermediate'}`, 20, yPosition);
      yPosition += 20;
      
      // Investment Strategy Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Recommended Investment Strategy', 20, yPosition);
      yPosition += 15;
      
      const strategy = analysis?.investmentStrategy;
      if (strategy) {
        doc.setFontSize(10);
        doc.text(`Equity Allocation: ${strategy.equity}%`, 20, yPosition);
        yPosition += 8;
        doc.text(`Debt Allocation: ${strategy.debt}%`, 20, yPosition);
        yPosition += 8;
        doc.text(`Gold Allocation: ${strategy.gold}%`, 20, yPosition);
        yPosition += 8;
        doc.text(`Strategy: ${strategy.description || 'Balanced approach between growth and stability'}`, 20, yPosition);
        yPosition += 20;
      }
      
      // Financial Goals Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Financial Goals', 20, yPosition);
      yPosition += 15;
      
      const goals = analysis?.goals;
      if (goals) {
        doc.setFontSize(10);
        doc.text(`Primary Goal: ${goals.primary || 'Wealth Building'}`, 20, yPosition);
        yPosition += 8;
        doc.text(`Time Horizon: ${goals.timeHorizon || '5-10 years'}`, 20, yPosition);
        yPosition += 8;
        doc.text(`Monthly Investment: ${goals.monthlyInvestment || '₹10,000'}`, 20, yPosition);
        yPosition += 20;
      }
      
      // Recommendations Section
      if (analysis?.recommendations && analysis.recommendations.length > 0) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('AI-Powered Recommendations', 20, yPosition);
        yPosition += 15;
        
        doc.setFontSize(10);
        analysis.recommendations.forEach((rec, index) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`${index + 1}. ${rec.title}`, 20, yPosition);
          yPosition += 8;
          doc.text(`   ${rec.description}`, 20, yPosition);
          yPosition += 12;
        });
        yPosition += 10;
      }
      
      // Asset Allocation Chart
      if (analysis?.assetAllocation && analysis.assetAllocation.length > 0) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Asset Allocation', 20, yPosition);
        yPosition += 15;
        
        // Create table for asset allocation
        const tableData = analysis.assetAllocation.map(asset => [
          asset.name,
          `${asset.value}%`,
          'Recommended'
        ]);
        
        doc.autoTable({
          startY: yPosition,
          head: [['Asset Class', 'Allocation', 'Status']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [59, 130, 246] },
          styles: { fontSize: 10 }
        });
        
        yPosition = doc.lastAutoTable.finalY + 20;
      }
      
      // Profile Questions Summary
      if (profileData) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Profile Summary', 20, yPosition);
        yPosition += 15;
        
        doc.setFontSize(10);
        doc.text('Based on your responses to our comprehensive financial questionnaire,', 20, yPosition);
        yPosition += 8;
        doc.text('we have analyzed your financial situation and provided personalized', 20, yPosition);
        yPosition += 8;
        doc.text('recommendations tailored to your goals and risk tolerance.', 20, yPosition);
        yPosition += 20;
      }
      
      // Footer
      const footerY = pageHeight - 20;
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text('Generated by FuturePath AI - Your Personal Financial Assistant', 20, footerY);
      doc.text(`Page 1 of 1`, pageWidth - 30, footerY);
      
      // Save the PDF
      const fileName = `FuturePath_Financial_Report_${userInfo?.name?.replace(/\s+/g, '_') || 'User'}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      setIsGenerated(true);
      setTimeout(() => setIsGenerated(false), 3000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Financial Report</h3>
            <p className="text-sm text-gray-600">Generate comprehensive PDF report</p>
          </div>
        </div>
        
        <button
          onClick={generatePDFReport}
          disabled={isGenerating || !analysis}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isGenerating || !analysis
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isGenerated
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : isGenerated ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Generated!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Generate PDF</span>
            </>
          )}
        </button>
      </div>
      
      {!analysis && (
        <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Complete your profile to generate a report</span>
        </div>
      )}
      
      {analysis && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Risk Profile</div>
              <div className="font-semibold text-gray-900">{analysis.riskProfile}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Experience</div>
              <div className="font-semibold text-gray-900">{analysis.experience}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">User Type</div>
              <div className="font-semibold text-gray-900">{analysis.userTypeTitle}</div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p className="mb-2">The PDF report will include:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Personal information and user type</li>
              <li>Risk profile analysis and score</li>
              <li>Recommended investment strategy</li>
              <li>Financial goals and timeline</li>
              <li>AI-powered recommendations</li>
              <li>Asset allocation breakdown</li>
              <li>Profile summary and insights</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFReportGenerator;

