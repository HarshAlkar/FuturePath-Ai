// import React, { useRef, useState } from 'react';

// // Enhanced AI icon with better visual design matching the image
// const AIIcon = () => (
//   <div className="relative">
//     {/* Main outer circle with blue-purple gradient */}
//     <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-full shadow-2xl border-4 border-white animate-pulse relative">
//       {/* Inner circle with teal-green gradient */}
//       <div className="absolute inset-2 bg-gradient-to-br from-teal-400 to-green-500 rounded-full border-2 border-white">
//         {/* AI face icon in the center */}
//         <div className="absolute inset-0 flex items-center justify-center">
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <circle cx="12" cy="12" r="10" />
//             <path d="M8 15s1.5 2 4 2 4-2 4-2" />
//             <path d="M9 9h.01" />
//             <path d="M15 9h.01" />
//           </svg>
//         </div>
//       </div>
//     </div>
    
//     {/* AI Badge */}
//     <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg border-2 border-white font-bold">
//       <span>AI</span>
//     </div>
//   </div>
// );

// const exampleCommands = [
//   // Navigation commands
//   { en: 'Go to dashboard', hi: 'डैशबोर्ड खोलो', category: 'nav' },
//   { en: 'Show my goals', hi: 'लक्ष्य दिखाओ', category: 'nav' },
//   { en: 'Add a new goal', hi: 'नया लक्ष्य जोड़ो', category: 'nav' },
//   { en: 'Show savings', hi: 'बचत दिखाओ', category: 'nav' },
//   { en: 'Logout', hi: 'लॉगआउट', category: 'nav' },
//   { en: 'Help', hi: 'मदद', category: 'nav' },
//   // Stock market commands
//   { en: 'Stock market analysis', hi: 'शेयर मार्केट विश्लेषण', category: 'stock' },
//   { en: 'Which stocks to buy', hi: 'कौन से शेयर खरीदें', category: 'stock' },
//   { en: 'Market trends today', hi: 'आज के मार्केट ट्रेंड', category: 'stock' },
//   { en: 'Stock price of TCS', hi: 'TCS का शेयर प्राइस', category: 'stock' },
//   { en: 'Best stocks for investment', hi: 'निवेश के लिए सर्वश्रेष्ठ शेयर', category: 'stock' },
//   { en: 'Market prediction', hi: 'मार्केट भविष्यवाणी', category: 'stock' },
// ];

// const AIAssistant = () => {
//   const [listening, setListening] = useState(false);
//   const [input, setInput] = useState('');
//   const [conversation, setConversation] = useState([]);
//   const [feedback, setFeedback] = useState('');
//   const [showChat, setShowChat] = useState(false);
//   const [language, setLanguage] = useState('en-IN');
//   const [activeCategory, setActiveCategory] = useState('all');
//   const recognitionRef = useRef(null);

//   // --- Voice Recognition ---
//   const startListening = () => {
//     if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
//       setFeedback('Voice recognition not supported in this browser.');
//       return;
//     }
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognitionRef.current = recognition;
//     recognition.lang = language;
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;
//     recognition.continuous = false;
//     setFeedback(language === 'hi-IN' ? 'सुन रहा हूँ...' : 'Listening...');
//     setListening(true);

//     recognition.onresult = (event) => {
//       const text = event.results[0][0].transcript;
//       setInput('');
//       setListening(false);
//       setFeedback('');
//       handleUserInput(text, true);
//     };
//     recognition.onerror = (event) => {
//       setFeedback(language === 'hi-IN' ? 'समझ नहीं पाया। फिर से बोलें।' : 'Could not recognize. Try again.');
//       setListening(false);
//     };
//     recognition.onend = () => {
//       setListening(false);
//     };
//     recognition.start();
//   };

//   const stopListening = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//     }
//     setListening(false);
//     setFeedback('');
//   };

//   // --- Voice Output ---
//   const speak = (text, lang) => {
//     if ('speechSynthesis' in window) {
//       const utter = new window.SpeechSynthesisUtterance(text);
//       utter.lang = lang || language;
//       window.speechSynthesis.speak(utter);
//     }
//   };

//   // --- Stock Market Knowledge Base ---
//   const getStockAnalysis = (query) => {
//     const lower = query.toLowerCase();
    
//     // Stock recommendations
//     if (lower.includes('buy') || lower.includes('खरीद') || lower.includes('recommend')) {
//       return language === 'hi-IN' 
//         ? 'मैं आपको निम्नलिखित शेयर खरीदने की सलाह देता हूं: TCS, Infosys, HDFC Bank, Reliance Industries। ये सभी मजबूत fundamentals के साथ अच्छे returns दे रहे हैं।'
//         : 'I recommend buying: TCS, Infosys, HDFC Bank, Reliance Industries. These stocks have strong fundamentals and good returns.';
//     }
    
//     // Market trends
//     if (lower.includes('trend') || lower.includes('ट्रेंड') || lower.includes('market')) {
//       return language === 'hi-IN'
//         ? 'आज का मार्केट बुलिश है। Nifty 50 में 2% की वृद्धि हुई है। IT और Banking सेक्टर में अच्छी गति है।'
//         : 'Today\'s market is bullish. Nifty 50 is up 2%. IT and Banking sectors are performing well.';
//     }
    
//     // Stock prices
//     if (lower.includes('price') || lower.includes('प्राइस') || lower.includes('tcs') || lower.includes('infosys')) {
//       return language === 'hi-IN'
//         ? 'TCS का वर्तमान प्राइस ₹3,850 है, जो पिछले हफ्ते से 5% ऊपर है। Infosys ₹1,650 पर है।'
//         : 'TCS current price is ₹3,850, up 5% from last week. Infosys is at ₹1,650.';
//     }
    
//     // Investment advice
//     if (lower.includes('investment') || lower.includes('निवेश') || lower.includes('best')) {
//       return language === 'hi-IN'
//         ? 'लंबी अवधि के निवेश के लिए: HDFC Bank, TCS, Infosys, Reliance। SIP में निवेश करें और रेगुलर रिव्यू करें।'
//         : 'For long-term investment: HDFC Bank, TCS, Infosys, Reliance. Invest in SIP and review regularly.';
//     }
    
//     // Market prediction
//     if (lower.includes('prediction') || lower.includes('भविष्यवाणी') || lower.includes('future')) {
//       return language === 'hi-IN'
//         ? 'अगले 3 महीनों में मार्केट 10-15% बढ़ने की उम्मीद है। IT और Pharma सेक्टर में अच्छी opportunities हैं।'
//         : 'Market expected to grow 10-15% in next 3 months. Good opportunities in IT and Pharma sectors.';
//     }
    
//     // General stock advice
//     return language === 'hi-IN'
//       ? 'शेयर मार्केट में निवेश करने से पहले रिसर्च करें। Diversification जरूरी है। Risk management पर ध्यान दें।'
//       : 'Do thorough research before investing in stocks. Diversification is important. Focus on risk management.';
//   };

//   // --- Command Handler ---
//   const handleUserInput = async (text, isVoice = false) => {
//     setConversation((conv) => [...conv, { from: 'user', text }]);
    
//     // Normalize navigation phrases
//     const lower = text.toLowerCase();
//     const navPhrases = [
//       'go to ', 'open ', 'show ', 'navigate to ', 'display ', 'खोलो', 'दिखाओ', 'जाओ', 'चलो'
//     ];
//     let command = lower;
//     navPhrases.forEach(phrase => {
//       command = command.replace(phrase, '');
//     });

//     // --- Stock Market Commands ---
//     if (command.includes('stock') || command.includes('market') || command.includes('share') || 
//         command.includes('शेयर') || command.includes('मार्केट') || command.includes('स्टॉक') ||
//         command.includes('buy') || command.includes('sell') || command.includes('hold') ||
//         command.includes('खरीद') || command.includes('बेच') || command.includes('रख') ||
//         command.includes('price') || command.includes('trend') || command.includes('analysis') ||
//         command.includes('प्राइस') || command.includes('ट्रेंड') || command.includes('विश्लेषण') ||
//         command.includes('investment') || command.includes('निवेश') || command.includes('recommend')) {
      
//       const stockAnalysis = getStockAnalysis(command);
//       setConversation((conv) => [...conv, { from: 'ai', text: stockAnalysis }]);
//       speak(stockAnalysis, language);
//       return;
//     }

//     // --- Local Navigation Commands ---
//     if (command.includes('dashboard') || command.includes('main dashboard') || command.includes('home') || command.includes('डैशबोर्ड') || command.includes('मुख्य पृष्ठ')) {
//       const msg = language === 'hi-IN' ? 'डैशबोर्ड खोल रहा हूँ...' : 'Navigating to Dashboard...';
//       setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
//       speak(msg, language);
//       window.location.href = '/main-dashboard';
//       return;
//     } else if (command.includes('goal') || command.includes('लक्ष्य') || command.includes('गोल')) {
//       const msg = language === 'hi-IN' ? 'लक्ष्य पेज खोल रहा हूँ...' : 'Navigating to Goals...';
//       setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
//       speak(msg, language);
//       window.location.href = '/goals';
//       return;
//     } else if (command.includes('insight') || command.includes('इनसाइट') || command.includes('जानकारी')) {
//       const msg = language === 'hi-IN' ? 'इनसाइट्स पेज खोल रहा हूँ...' : 'Navigating to Insights...';
//       setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
//       speak(msg, language);
//       window.location.href = '/insights';
//       return;
//     } else if (command.includes('setting') || command.includes('सेटिंग') || command.includes('सेटिंग्स')) {
//       const msg = language === 'hi-IN' ? 'सेटिंग्स पेज खोल रहा हूँ...' : 'Navigating to Settings...';
//       setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
//       speak(msg, language);
//       window.location.href = '/settings';
//       return;
//     } else if (command.includes('profile') || command.includes('प्रोफाइल')) {
//       const msg = language === 'hi-IN' ? 'प्रोफाइल पेज खोल रहा हूँ...' : 'Navigating to Profile...';
//       setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
//       speak(msg, language);
//       window.location.href = '/profile';
//       return;
//     } else if (command.includes('tracker') || command.includes('expense') || command.includes('खर्चा') || command.includes('ट्रैकर')) {
//       const msg = language === 'hi-IN' ? 'खर्चा ट्रैकर खोल रहा हूँ...' : 'Navigating to Expense Tracker...';
//       setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
//       speak(msg, language);
//       window.location.href = '/expense-tracker';
//       return;
//     } else if (command.includes('logout') || command.includes('लॉगआउट')) {
//       const msg = language === 'hi-IN' ? 'लॉगआउट कर रहा हूँ...' : 'Logging out...';
//       setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
//       speak(msg, language);
//       window.location.href = '/login';
//       return;
//     } else if (command.includes('help') || command.includes('मदद')) {
//       const msg = language === 'hi-IN' 
//         ? 'मैं आपकी मदद कर सकता हूं: पेज खोलने, लक्ष्य जोड़ने, शेयर मार्केट विश्लेषण, निवेश सलाह, और बहुत कुछ। बस बोलें या टाइप करें!'
//         : 'I can help you with: opening pages, adding goals, stock market analysis, investment advice, and much more. Just speak or type!';
//       setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
//       speak(msg, language);
//       return;
//     } else if (command.includes('add goal') || command.includes('नया लक्ष्य')) {
//       const msg = language === 'hi-IN' ? 'नया लक्ष्य जोड़ने के लिए फॉर्म खोल रहा हूँ...' : 'Opening add goal form...';
//       setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
//       speak(msg, language);
//       window.location.href = '/goals';
//       return;
//     } else if (command.includes('show savings') || command.includes('बचत')) {
//       const msg = language === 'hi-IN' ? 'आपकी बचत डैशबोर्ड में दिखाई जा रही है।' : 'Your savings are shown on the dashboard.';
//       setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
//       speak(msg, language);
//       window.location.href = '/main-dashboard';
//       return;
//     } else if (command.includes('notification') || command.includes('सूचना')) {
//       const msg = language === 'hi-IN' ? 'सूचनाएँ दिखा रहा हूँ...' : 'Showing notifications...';
//       setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
//       speak(msg, language);
//       return;
//     } else if (command.includes('progress') || command.includes('प्रगति')) {
//       const msg = language === 'hi-IN' ? 'आपकी प्रगति डैशबोर्ड में है।' : 'Your progress is on the dashboard.';
//       setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
//       speak(msg, language);
//       window.location.href = '/main-dashboard';
//       return;
//     } else if (command.includes('switch language') || command.includes('भाषा बदलो')) {
//       const newLang = language === 'en-IN' ? 'hi-IN' : 'en-IN';
//       setLanguage(newLang);
//       const msg = newLang === 'hi-IN' ? 'भाषा हिंदी में बदल गई है।' : 'Language switched to English.';
//       setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
//       speak(msg, newLang);
//       return;
//     }

//     // --- Backend AI Integration (placeholder) ---
//     const thinkingMsg = language === 'hi-IN' ? 'सोच रहा हूँ...' : 'Thinking...';
//     setConversation((conv) => [...conv, { from: 'ai', text: thinkingMsg, thinking: true }]);
//     speak(thinkingMsg, language);
//     setFeedback(language === 'hi-IN' ? 'AI से उत्तर ला रहा हूँ...' : 'Getting answer from AI...');
//     try {
//       const res = await fetch('/api/ai-assistant', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text, lang: language })
//       });
//       const data = await res.json();
//       setConversation((conv) => {
//         const convCopy = conv.slice();
//         const last = convCopy[convCopy.length - 1];
//         if (last && last.thinking) convCopy.pop();
//         return [...convCopy, { from: 'ai', text: data.reply }];
//       });
//       speak(data.reply, language);
//       setFeedback('');
//     } catch (err) {
//       setConversation((conv) => {
//         const convCopy = conv.slice();
//         const last = convCopy[convCopy.length - 1];
//         if (last && last.thinking) convCopy.pop();
//         return [...convCopy, { from: 'ai', text: language === 'hi-IN' ? 'AI से उत्तर नहीं मिला।' : 'Could not get answer from AI.' }];
//       });
//       setFeedback('');
//     }
//   };

//   const filteredCommands = activeCategory === 'all' 
//     ? exampleCommands 
//     : exampleCommands.filter(cmd => cmd.category === activeCategory);

//   // --- UI ---
//   return (
//     <div>
//       {/* Enhanced Floating AI Icon with better visibility */}
//       <div
//         className={`fixed bottom-8 right-8 z-50 cursor-pointer hover:scale-110 transition-transform ${showChat ? 'hidden' : ''}`}
//         onClick={() => setShowChat(true)}
//         title={language === 'hi-IN' ? 'AI सहायक से बात करें' : 'Talk to AI Assistant'}
//       >
//         <AIIcon />
//         <div className="absolute -top-2 -right-2">
//           <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
//             <span>AI</span>
//           </div>
//         </div>
//         <div className="absolute bottom-0 right-0">
//           <button
//             className={`mt-2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white bg-gradient-to-br from-green-500 to-blue-600 text-white`}
//             style={{ outline: 'none' }}
//             aria-label="Voice Command"
//           >
//             <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <circle cx="12" cy="12" r="10" />
//               <path d="M12 8v4" />
//               <path d="M9 12h6" />
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Enhanced Chat Window */}
//       {showChat && (
//         <div className="fixed bottom-8 right-8 z-50 w-96 max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-blue-200 flex flex-col animate-fade-in">
//           {/* Enhanced Header */}
//           <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
//             <div className="flex items-center space-x-3">
//               <AIIcon />
//               <div>
//                 <span className="font-bold text-blue-700 text-lg">AI Assistant</span>
//                 <div className="text-xs text-blue-600">Stock Market Expert</div>
//               </div>
//             </div>
//             <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none">×</button>
//           </div>

//           {/* Enhanced Conversation */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 400 }}>
//             {conversation.length === 0 && (
//               <div className="text-center py-4">
//                 <div className="text-gray-500 text-sm mb-2">
//                   {language === 'hi-IN' ? 'नमस्ते! मैं आपकी मदद के लिए यहाँ हूँ।' : 'Hi! I am here to help you.'}
//                 </div>
//                 <div className="text-xs text-blue-600">
//                   {language === 'hi-IN' ? 'शेयर मार्केट, निवेश, और वित्तीय सलाह के लिए पूछें।' : 'Ask me about stocks, investments, and financial advice.'}
//                 </div>
//               </div>
//             )}
//             {conversation.map((msg, idx) => (
//               <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
//                 <div className={`rounded-xl px-3 py-2 max-w-[85%] text-sm ${msg.from === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-blue-600 text-white'}`}>
//                   {msg.text}
//                   {msg.thinking && (
//                     <span className="ml-2 inline-block align-middle">
//                       <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce mr-1" style={{animationDelay: '0ms'}}></span>
//                       <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce mr-1" style={{animationDelay: '150ms'}}></span>
//                       <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//             {feedback && <div className="text-blue-500 text-xs mt-2">{feedback}</div>}
//           </div>

//           {/* Enhanced Input & Controls */}
//           <div className="flex items-center p-3 border-t border-blue-100 space-x-2 bg-blue-50 rounded-b-2xl">
//             <button
//               onClick={listening ? stopListening : startListening}
//               className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white bg-gradient-to-br from-green-500 to-blue-600 text-white ${listening ? 'animate-pulse scale-110' : ''}`}
//               aria-label={language === 'hi-IN' ? 'माइक' : 'Mic'}
//               title={language === 'hi-IN' ? 'बोलें' : 'Speak'}
//             >
//               <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <circle cx="12" cy="12" r="10" />
//                 <path d="M12 8v4" />
//                 <path d="M9 12h6" />
//               </svg>
//             </button>
//             <input
//               className="flex-1 rounded-lg border border-blue-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder={language === 'hi-IN' ? 'शेयर मार्केट या निवेश के बारे में पूछें...' : 'Ask about stocks, investments...'}
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={e => {
//                 if (e.key === 'Enter' && input.trim()) {
//                   handleUserInput(input.trim());
//                   setInput('');
//                 }
//               }}
//               disabled={listening}
//             />
//             <button
//               onClick={() => {
//                 if (input.trim()) {
//                   handleUserInput(input.trim());
//                   setInput('');
//                 }
//               }}
//               className="ml-1 px-3 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all"
//               disabled={listening}
//             >
//               {language === 'hi-IN' ? 'भेजें' : 'Send'}
//             </button>
//             <button
//               onClick={() => setLanguage(language === 'en-IN' ? 'hi-IN' : 'en-IN')}
//               className="ml-1 px-2 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold shadow hover:bg-blue-200 transition-all text-xs"
//               title={language === 'en-IN' ? 'Switch to Hindi' : 'Switch to English'}
//             >
//               {language === 'en-IN' ? 'हिंदी' : 'EN'}
//             </button>
//           </div>

//           {/* Enhanced Example Commands with Categories */}
//           <div className="p-3 border-t border-blue-100 bg-blue-50 rounded-b-2xl">
//             <div className="flex space-x-2 mb-2">
//               <button
//                 onClick={() => setActiveCategory('all')}
//                 className={`px-2 py-1 rounded text-xs font-medium ${activeCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
//               >
//                 All
//               </button>
//               <button
//                 onClick={() => setActiveCategory('nav')}
//                 className={`px-2 py-1 rounded text-xs font-medium ${activeCategory === 'nav' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
//               >
//                 Navigation
//               </button>
//               <button
//                 onClick={() => setActiveCategory('stock')}
//                 className={`px-2 py-1 rounded text-xs font-medium ${activeCategory === 'stock' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
//               >
//                 Stocks
//               </button>
//             </div>
//             <div className="text-xs text-gray-500 flex flex-wrap gap-2">
//               {filteredCommands.map((cmd, i) => (
//                 <span 
//                   key={i} 
//                   className="bg-blue-100 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 transition-colors" 
//                   onClick={() => handleUserInput(language === 'hi-IN' ? cmd.hi : cmd.en)}
//                 >
//                   {language === 'hi-IN' ? cmd.hi : cmd.en}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AIAssistant; 



import React, { useRef, useState } from 'react';

// Enhanced AI icon with better visual design
const AIIcon = () => (
  <div className="relative">
    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-full shadow-2xl border-4 border-white animate-pulse relative">
      <div className="absolute inset-2 bg-gradient-to-br from-teal-400 to-green-500 rounded-full border-2 border-white">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 15s1.5 2 4 2 4-2 4-2" />
            <path d="M9 9h.01" />
            <path d="M15 9h.01" />
          </svg>
        </div>
      </div>
    </div>
    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg border-2 border-white font-bold">
      <span>AI</span>
    </div>
  </div>
);

const exampleCommands = [
  { en: 'Go to dashboard', hi: 'डैशबोर्ड खोलो', category: 'nav' },
  { en: 'Show my goals', hi: 'लक्ष्य दिखाओ', category: 'nav' },
  { en: 'Add a new goal', hi: 'नया लक्ष्य जोड़ो', category: 'nav' },
  { en: 'Show savings', hi: 'बचत दिखाओ', category: 'nav' },
  { en: 'Logout', hi: 'लॉगआउट', category: 'nav' },
  { en: 'Help', hi: 'मदद', category: 'nav' },
  { en: 'Stock market analysis', hi: 'शेयर मार्केट विश्लेषण', category: 'stock' },
  { en: 'Which stocks to buy', hi: 'कौन से शेयर खरीदें', category: 'stock' },
  { en: 'Market trends today', hi: 'आज के मार्केट ट्रेंड', category: 'stock' },
  { en: 'Stock price of TCS', hi: 'TCS का शेयर प्राइस', category: 'stock' },
  { en: 'Best stocks for investment', hi: 'निवेश के लिए सर्वश्रेष्ठ शेयर', category: 'stock' },
  { en: 'Market prediction', hi: 'मार्केट भविष्यवाणी', category: 'stock' },
];

const AIAssistant = () => {
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [language, setLanguage] = useState('en-IN');
  const [activeCategory, setActiveCategory] = useState('all');
  const recognitionRef = useRef(null);

  // Voice Recognition
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setFeedback('Voice recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    setFeedback(language === 'hi-IN' ? 'सुन रहा हूँ...' : 'Listening...');
    setListening(true);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setInput('');
      setListening(false);
      setFeedback('');
      handleUserInput(text, true);
    };
    recognition.onerror = (event) => {
      setFeedback(language === 'hi-IN' ? 'समझ नहीं पाया। फिर से बोलें।' : 'Could not recognize. Try again.');
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
    };
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
    setFeedback('');
  };

  // Voice Output
  const speak = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = lang || language;
      window.speechSynthesis.speak(utter);
    }
  };

  // Stock Market Knowledge Base
  const getStockAnalysis = (query) => {
    const lower = query.toLowerCase();
    if (lower.includes('buy') || lower.includes('खरीद') || lower.includes('recommend')) {
      return language === 'hi-IN'
        ? 'मैं आपको निम्नलिखित शेयर खरीदने की सलाह देता हूं: TCS, Infosys, HDFC Bank, Reliance Industries। ये सभी मजबूत fundamentals के साथ अच्छे returns दे रहे हैं।'
        : 'I recommend buying: TCS, Infosys, HDFC Bank, Reliance Industries. These stocks have strong fundamentals and good returns.';
    }
    if (lower.includes('trend') || lower.includes('ट्रेंड') || lower.includes('market')) {
      return language === 'hi-IN'
        ? 'आज का मार्केट बुलिश है। Nifty 50 में 2% की वृद्धि हुई है। IT और Banking सेक्टर में अच्छी गति है।'
        : 'Today\'s market is bullish. Nifty 50 is up 2%. IT and Banking sectors are performing well.';
    }
    if (lower.includes('price') || lower.includes('प्राइस') || lower.includes('tcs') || lower.includes('infosys')) {
      return language === 'hi-IN'
        ? 'TCS का वर्तमान प्राइस ₹3,850 है, जो पिछले हफ्ते से 5% ऊपर है। Infosys ₹1,650 पर है।'
        : 'TCS current price is ₹3,850, up 5% from last week. Infosys is at ₹1,650.';
    }
    if (lower.includes('investment') || lower.includes('निवेश') || lower.includes('best')) {
      return language === 'hi-IN'
        ? 'लंबी अवधि के निवेश के लिए: HDFC Bank, TCS, Infosys, Reliance। SIP में निवेश करें और रेगुलर रिव्यू करें।'
        : 'For long-term investment: HDFC Bank, TCS, Infosys, Reliance. Invest in SIP and review regularly.';
    }
    if (lower.includes('prediction') || lower.includes('भविष्यवाणी') || lower.includes('future')) {
      return language === 'hi-IN'
        ? 'अगले 3 महीनों में मार्केट 10-15% बढ़ने की उम्मीद है। IT और Pharma सेक्टर में अच्छी opportunities हैं।'
        : 'Market expected to grow 10-15% in next 3 months. Good opportunities in IT and Pharma sectors.';
    }
    return language === 'hi-IN'
      ? 'शेयर मार्केट में निवेश करने से पहले रिसर्च करें। Diversification जरूरी है। Risk management पर ध्यान दें।'
      : 'Do thorough research before investing in stocks. Diversification is important. Focus on risk management.';
  };

  // Command Handler
  const handleUserInput = async (text, isVoice = false) => {
    setConversation((conv) => [...conv, { from: 'user', text }]);

    const lower = text.toLowerCase();
    const navPhrases = [
      'go to ', 'open ', 'show ', 'navigate to ', 'display ', 'खोलो', 'दिखाओ', 'जाओ', 'चलो'
    ];
    let command = lower;
    navPhrases.forEach(phrase => {
      command = command.replace(phrase, '');
    });

    // Stock Market Commands
    if (command.includes('stock') || command.includes('market') || command.includes('share') ||
        command.includes('शेयर') || command.includes('मार्केट') || command.includes('स्टॉक') ||
        command.includes('buy') || command.includes('sell') || command.includes('hold') ||
        command.includes('खरीद') || command.includes('बेच') || command.includes('रख') ||
        command.includes('price') || command.includes('trend') || command.includes('analysis') ||
        command.includes('प्राइस') || command.includes('ट्रेंड') || command.includes('विश्लेषण') ||
        command.includes('investment') || command.includes('निवेश') || command.includes('recommend')) {
      const stockAnalysis = getStockAnalysis(command);
      setConversation((conv) => [...conv, { from: 'ai', text: stockAnalysis }]);
      speak(stockAnalysis, language);
      return;
    }

    // Navigation Commands
    if (command.includes('dashboard') || command.includes('main dashboard') || command.includes('home') || command.includes('डैशबोर्ड') || command.includes('मुख्य पृष्ठ')) {
      const msg = language === 'hi-IN' ? 'डैशबोर्ड खोल रहा हूँ...' : 'Navigating to Dashboard...';
      setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
      speak(msg, language);
      window.location.href = '/main-dashboard';
      return;
    } else if (command.includes('goal') || command.includes('लक्ष्य') || command.includes('गोल')) {
      const msg = language === 'hi-IN' ? 'लक्ष्य पेज खोल रहा हूँ...' : 'Navigating to Goals...';
      setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
      speak(msg, language);
      window.location.href = '/goals';
      return;
    } else if (command.includes('insight') || command.includes('इनसाइट') || command.includes('जानकारी')) {
      const msg = language === 'hi-IN' ? 'इनसाइट्स पेज खोल रहा हूँ...' : 'Navigating to Insights...';
      setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
      speak(msg, language);
      window.location.href = '/insights';
      return;
    } else if (command.includes('setting') || command.includes('सेटिंग') || command.includes('सेटिंग्स')) {
      const msg = language === 'hi-IN' ? 'सेटिंग्स पेज खोल रहा हूँ...' : 'Navigating to Settings...';
      setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
      speak(msg, language);
      window.location.href = '/settings';
      return;
    } else if (command.includes('profile') || command.includes('प्रोफाइल')) {
      const msg = language === 'hi-IN' ? 'प्रोफाइल पेज खोल रहा हूँ...' : 'Navigating to Profile...';
      setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
      speak(msg, language);
      window.location.href = '/profile';
      return;
    } else if (command.includes('tracker') || command.includes('expense') || command.includes('खर्चा') || command.includes('ट्रैकर')) {
      const msg = language === 'hi-IN' ? 'खर्चा ट्रैकर खोल रहा हूँ...' : 'Navigating to Expense Tracker...';
      setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
      speak(msg, language);
      window.location.href = '/expense-tracker';
      return;
    } else if (command.includes('logout') || command.includes('लॉगआउट')) {
      const msg = language === 'hi-IN' ? 'लॉगआउट कर रहा हूँ...' : 'Logging out...';
      setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
      speak(msg, language);
      window.location.href = '/login';
      return;
    } else if (command.includes('help') || command.includes('मदद')) {
      const msg = language === 'hi-IN'
        ? 'मैं आपकी मदद कर सकता हूं: पेज खोलने, लक्ष्य जोड़ने, शेयर मार्केट विश्लेषण, निवेश सलाह, और बहुत कुछ। बस बोलें या टाइप करें!'
        : 'I can help you with: opening pages, adding goals, stock market analysis, investment advice, and much more. Just speak or type!';
      setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
      speak(msg, language);
      return;
    } else if (command.includes('add goal') || command.includes('नया लक्ष्य')) {
      const msg = language === 'hi-IN' ? 'नया लक्ष्य जोड़ने के लिए फॉर्म खोल रहा हूँ...' : 'Opening add goal form...';
      setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
      speak(msg, language);
      window.location.href = '/goals';
      return;
    } else if (command.includes('show savings') || command.includes('बचत')) {
      const msg = language === 'hi-IN' ? 'आपकी बचत डैशबोर्ड में दिखाई जा रही है।' : 'Your savings are shown on the dashboard.';
      setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
      speak(msg, language);
      window.location.href = '/main-dashboard';
      return;
    } else if (command.includes('notification') || command.includes('सूचना')) {
      const msg = language === 'hi-IN' ? 'सूचनाएँ दिखा रहा हूँ...' : 'Showing notifications...';
      setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
      speak(msg, language);
      return;
    } else if (command.includes('progress') || command.includes('प्रगति')) {
      const msg = language === 'hi-IN' ? 'आपकी प्रगति डैशबोर्ड में है।' : 'Your progress is on the dashboard.';
      setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
      speak(msg, language);
      window.location.href = '/main-dashboard';
      return;
    } else if (command.includes('switch language') || command.includes('भाषा बदलो')) {
      const newLang = language === 'en-IN' ? 'hi-IN' : 'en-IN';
      setLanguage(newLang);
      const msg = newLang === 'hi-IN' ? 'भाषा हिंदी में बदल गई है।' : 'Language switched to English.';
      setConversation((conv) => [...conv, { from: 'ai', text: msg }]);
      speak(msg, newLang);
      return;
    }

    // OpenAI Integration
    const thinkingMsg = language === 'hi-IN' ? 'सोच रहा हूँ...' : 'Thinking...';
    setConversation((conv) => [...conv, { from: 'ai', text: thinkingMsg, thinking: true }]);
    speak(thinkingMsg, language);
    setFeedback(language === 'hi-IN' ? 'AI से उत्तर ला रहा हूँ...' : 'Getting answer from AI...');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, lang: language })
      });
      const data = await res.json();
      if (data.success) {
        setConversation((conv) => {
          const convCopy = conv.slice();
          const last = convCopy[convCopy.length - 1];
          if (last && last.thinking) convCopy.pop();
          return [...convCopy, { from: 'ai', text: data.reply }];
        });
        speak(data.reply, language);
      } else {
        throw new Error(data.message);
      }
      setFeedback('');
    } catch (err) {
      setConversation((conv) => {
        const convCopy = conv.slice();
        const last = convCopy[convCopy.length - 1];
        if (last && last.thinking) convCopy.pop();
        return [...convCopy, { from: 'ai', text: language === 'hi-IN' ? 'AI से उत्तर नहीं मिला।' : 'Could not get answer from AI.' }];
      });
      setFeedback('');
    }
  };

  const filteredCommands = activeCategory === 'all'
    ? exampleCommands
    : exampleCommands.filter(cmd => cmd.category === activeCategory);

  // UI
  return (
    <div>
      <div
        className={`fixed bottom-8 right-8 z-50 cursor-pointer hover:scale-110 transition-transform ${showChat ? 'hidden' : ''}`}
        onClick={() => setShowChat(true)}
        title={language === 'hi-IN' ? 'AI सहायक से बात करें' : 'Talk to AI Assistant'}
      >
        <AIIcon />
        <div className="absolute -top-2 -right-2">
          <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            <span>AI</span>
          </div>
        </div>
        <div className="absolute bottom-0 right-0">
          <button
            className={`mt-2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white bg-gradient-to-br from-green-500 to-blue-600 text-white`}
            style={{ outline: 'none' }}
            aria-label="Voice Command"
          >
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M9 12h6" />
            </svg>
          </button>
        </div>
      </div>

      {showChat && (
        <div className="fixed bottom-8 right-8 z-50 w-96 max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-blue-200 flex flex-col animate-fade-in">
          <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <AIIcon />
              <div>
                <span className="font-bold text-blue-700 text-lg">AI Assistant</span>
                <div className="text-xs text-blue-600">Stock Market Expert</div>
              </div>
            </div>
            <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none">×</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 400 }}>
            {conversation.length === 0 && (
              <div className="text-center py-4">
                <div className="text-gray-500 text-sm mb-2">
                  {language === 'hi-IN' ? 'नमस्ते! मैं आपकी मदद के लिए यहाँ हूँ।' : 'Hi! I am here to help you.'}
                </div>
                <div className="text-xs text-blue-600">
                  {language === 'hi-IN' ? 'शेयर मार्केट, निवेश, और वित्तीय सलाह के लिए पूछें।' : 'Ask me about stocks, investments, and financial advice.'}
                </div>
              </div>
            )}
            {conversation.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-xl px-3 py-2 max-w-[85%] text-sm ${msg.from === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-blue-600 text-white'}`}>
                  {msg.text}
                  {msg.thinking && (
                    <span className="ml-2 inline-block align-middle">
                      <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce mr-1" style={{animationDelay: '0ms'}}></span>
                      <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce mr-1" style={{animationDelay: '150ms'}}></span>
                      <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                    </span>
                  )}
                </div>
              </div>
            ))}
            {feedback && <div className="text-blue-500 text-xs mt-2">{feedback}</div>}
          </div>

          <div className="flex items-center p-3 border-t border-blue-100 space-x-2 bg-blue-50 rounded-b-2xl">
            <button
              onClick={listening ? stopListening : startListening}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white bg-gradient-to-br from-green-500 to-blue-600 text-white ${listening ? 'animate-pulse scale-110' : ''}`}
              aria-label={language === 'hi-IN' ? 'माइक' : 'Mic'}
              title={language === 'hi-IN' ? 'बोलें' : 'Speak'}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4" />
                <path d="M9 12h6" />
              </svg>
            </button>
            <input
              className="flex-1 rounded-lg border border-blue-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={language === 'hi-IN' ? 'शेयर मार्केट या निवेश के बारे में पूछें...' : 'Ask about stocks, investments...'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && input.trim()) {
                  handleUserInput(input.trim());
                  setInput('');
                }
              }}
              disabled={listening}
            />
            <button
              onClick={() => {
                if (input.trim()) {
                  handleUserInput(input.trim());
                  setInput('');
                }
              }}
              className="ml-1 px-3 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all"
              disabled={listening}
            >
              {language === 'hi-IN' ? 'भेजें' : 'Send'}
            </button>
            <button
              onClick={() => setLanguage(language === 'en-IN' ? 'hi-IN' : 'en-IN')}
              className="ml-1 px-2 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold shadow hover:bg-blue-200 transition-all text-xs"
              title={language === 'en-IN' ? 'Switch to Hindi' : 'Switch to English'}
            >
              {language === 'en-IN' ? 'हिंदी' : 'EN'}
            </button>
          </div>

          <div className="p-3 border-t border-blue-100 bg-blue-50 rounded-b-2xl">
            <div className="flex space-x-2 mb-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-2 py-1 rounded text-xs font-medium ${activeCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveCategory('nav')}
                className={`px-2 py-1 rounded text-xs font-medium ${activeCategory === 'nav' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
              >
                Navigation
              </button>
              <button
                onClick={() => setActiveCategory('stock')}
                className={`px-2 py-1 rounded text-xs font-medium ${activeCategory === 'stock' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
              >
                Stocks
              </button>
            </div>
            <div className="text-xs text-gray-500 flex flex-wrap gap-2">
              {filteredCommands.map((cmd, i) => (
                <span
                  key={i}
                  className="bg-blue-100 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                  onClick={() => handleUserInput(language === 'hi-IN' ? cmd.hi : cmd.en)}
                >
                  {language === 'hi-IN' ? cmd.hi : cmd.en}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;