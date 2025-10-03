/*
  FuturePath AI - PPT Generator
  Usage:
    npm install pptxgenjs
    node docs/presentation/generate_ppt.js
  Output:
    FuturePathAI_Presentation.pptx in project root
*/

const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

function createSlideWithTitleAndBullets(pres, title, bullets) {
  const slide = pres.addSlide();
  slide.addText(title, { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 28, bold: true, color: '363636' });
  if (Array.isArray(bullets) && bullets.length > 0) {
    slide.addText(
      bullets.map((b) => ({ text: b, options: { bullet: true, fontSize: 18, color: '404040', lineSpacing: 18 } })),
      { x: 0.7, y: 1.2, w: 8.5, h: 4.5 }
    );
  }
  return slide;
}

(async () => {
  const pres = new PptxGenJS();
  pres.title = 'FuturePath AI - Financial Management Platform';
  pres.layout = 'LAYOUT_16x9';

  // Colors/styles
  const primary = '2563EB';
  const textDark = '1F2937';

  // Title Slide
  {
    const slide = pres.addSlide();
    slide.background = { color: 'FFFFFF' };
    slide.addText('FuturePath AI', { x: 0.6, y: 1.9, w: 8.8, h: 1, fontSize: 48, bold: true, color: textDark });
    slide.addText('Financial Management Platform', { x: 0.6, y: 2.7, w: 8.8, h: 0.6, fontSize: 24, color: textDark });
    slide.addShape(pres.ShapeType.rect, { x: 0.6, y: 3.6, w: 4.4, h: 0.25, fill: primary });
    slide.addText('Version 1.0.0  •  ISC License', { x: 0.6, y: 4.2, w: 8.8, h: 0.4, fontSize: 14, color: '4B5563' });
  }

  // Problem Statement
  createSlideWithTitleAndBullets(pres, 'Problem Statement', [
    'Users struggle to track expenses, set goals, and make informed financial decisions.',
    'Stock buy/sell decisions feel complex without proper analysis.',
    'Lack of unified tools for goals, insights, OCR receipts, and investments.'
  ]);

  // Idea & Solution
  createSlideWithTitleAndBullets(pres, 'Solution / Idea', [
    'Unified platform for expenses, goals, AI insights, and investments.',
    'AI-powered personalized guidance from real transaction and goal data.',
    'Stock Analyzer that offers Buy / Sell / Hold using simple signals (e.g., moving averages).'
  ]);

  // Literature Survey
  createSlideWithTitleAndBullets(pres, 'Literature Survey', [
    'Han (2020): Personal Financial Management tools and techniques.',
    'Patel (2021): AI in Personal Finance—opportunities and challenges.',
    'Chen et al. (2018): Stock movement prediction using tweets and prices.',
    'Bhatia (2020): Survey of stock market prediction via ML.'
  ]);

  // Key Features
  createSlideWithTitleAndBullets(pres, 'Key Features', [
    'Real-time financial dashboard and analytics',
    'Expense tracking with categorization and OCR receipts',
    'Goal management with timelines and progress',
    'AI insights: spending patterns, savings, investment tips',
    'Investment tracking and Stock Analyzer (Buy/Sell/Hold)' 
  ]);

  // Architecture
  createSlideWithTitleAndBullets(pres, 'Architecture (High-Level)', [
    'Frontend: React 19, Vite, Tailwind',
    'Backend: Node.js, Express.js',
    'Database: MongoDB (Mongoose ODM)',
    'Auth: JWT-based authentication',
    'AI: OpenAI API integration'
  ]);

  // AI Insights
  createSlideWithTitleAndBullets(pres, 'AI Insights', [
    'Analyzes income, expenses, goals, and metrics.',
    'Generates insights: spending patterns, savings opportunities, investment guidance.',
    'Modal-based presentation with priority and impact.'
  ]);

  // OCR Module
  createSlideWithTitleAndBullets(pres, 'OCR Receipt Detection', [
    'Client-side OCR with Tesseract.js; server fallback with multer.',
    'Parsing: vendor, date, items, totals, payment method.',
    'Validation and confidence scoring; auto-categorization.'
  ]);

  // Stock Analyzer
  createSlideWithTitleAndBullets(pres, 'Stock Analyzer', [
    'Input: stock symbol; fetch mock or API data.',
    'Signal: latest price vs simple moving average.',
    'Output: Buy / Sell / Hold recommendation.'
  ]);

  // APIs
  createSlideWithTitleAndBullets(pres, 'APIs (Summary)', [
    'Auth: /api/register, /api/login',
    'Transactions: /api/transactions, /api/transactions/stats',
    'Goals: /api/goals (CRUD)',
    'AI: /api/ai-tips'
  ]);

  // Testing & Troubleshooting
  createSlideWithTitleAndBullets(pres, 'Testing & Troubleshooting', [
    'Backend & frontend test scripts; manual verification checklist.',
    'OCR troubleshooting: image quality, validation, fallbacks.',
    'Debug tools: console logs, health checks, mock actions.'
  ]);

  // Performance & Security
  createSlideWithTitleAndBullets(pres, 'Performance & Security', [
    'Performance: indexing, caching, compression, code splitting.',
    'Security: JWT, bcrypt, input validation, CORS, rate limiting.',
    'Env management and secure error handling.'
  ]);

  // Roadmap
  createSlideWithTitleAndBullets(pres, 'Roadmap', [
    'Mobile app (React Native), ML analytics, multi-currency.',
    'Bank integrations, tax planner, social and voice features.',
    'WebSockets, Redis caching, CI/CD, advanced monitoring.'
  ]);

  // Team
  createSlideWithTitleAndBullets(pres, 'Team', [
    'Harsh Alkar',
    'Diksha Dweare',
    'Riddhi Bachim',
    'Shreyas Mane',
    'Manish Darge'
  ]);

  // Thank You
  createSlideWithTitleAndBullets(pres, 'Thank You / Q&A', [
    'Contact: support@futurepath-ai.com',
    'GitHub: Repository URL',
    'Docs: PROJECT_FULL_DOCUMENTATION.md'
  ]);

  const outPath = path.resolve(process.cwd(), 'FuturePathAI_Presentation.pptx');
  await pres.writeFile({ fileName: outPath });
  console.log('✅ PPT generated at:', outPath);
})();
