import React, { useState } from 'react';
import { BarChart3, Target, TrendingUp, CheckCircle, DollarSign, Shield, ChevronRight, Menu, X } from 'lucide-react';
import logo from '../assets/FinPilot_logo.svg'
import hero_vd from '../assets/hero_bg.webm'
import contact from '../assets/contact.webm'
import { Link } from 'react-router-dom';

export default function FuturePathAI() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.message) {
      console.log('Form submitted:', formData);
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="w-12     h-12 flex items-center">
                <img src={logo} alt="" />
            </div>
            <div className="flex items-center -ml-35">
              <div className="text-2xl font-bold text-blue-600">FuturePath AI</div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#home" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Home</a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">About</a>
                <a href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Features</a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Testimonials</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Contact</a>
              </div>
            </div>
            
            <div className="hidden md:block">
              <Link to="/get-started" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Get Started
              </Link>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-blue-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#home" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">Home</a>
              <a href="#about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">About</a>
              <a href="#features" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">Features</a>
              <a href="#testimonials" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">Testimonials</a>
              <a href="#contact" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">Contact</a>
              <Link to='/get-started' className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-2" />
                AI-Powered Financial Assistant
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Financial
                <span className="block text-blue-600">Copilot</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Track smarter. Predict clearer. Achieve more. All with AI at your side.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to='/get-started' className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
                  Get Started Free
                </Link>
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                  Watch Demo
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-2 mt-5 ml-2 -mr-10">
      
                {/* The Frame Itself:
                    1. `p-1` provides padding that will become the border's thickness.
                    2. `bg-gradient-to-br` creates the gradient background.
                    3. `rounded-2xl` gives it soft, rounded corners.
                */}
                <div className="relative w-200 h-94 p-1 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl">
                    
                    {/* The Inner "Hollow" Area:
                    1. `bg-white` provides the solid fill. You can change this to any color, 
                        like `bg-gray-900` for a dark mode theme.
                    2. `h-full` and `w-full` make it fill the parent container.
                    3. `rounded-[14px]` is slightly smaller than the parent's `rounded-2xl`
                        to ensure the border width is consistent.
                    */}
                    <div className="w-full h-full bg-white rounded-[14px] overflow-hidden">
                        <video
                            src={hero_vd}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        ></video>
                    </div>
                </div>

            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About FuturePath AI</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <p className="text-lg text-gray-600 leading-relaxed">
                FuturePath AI is your intelligent financial navigator, designed to transform how you manage, understand, and grow your money. We leverage cutting-edge AI to make personal finance assistants smart, and truly personalized, starting with a comprehensive 20-question financial profile.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Beyond simple tracking, FuturePath AI offers multiple logging methods including voice commands, automated SMS/Gmail parsing, manual entry, and even receipt scanning, ensuring every transaction is effortlessly captured and categorized.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Smart Analytics</h3>
                <p className="text-gray-600 text-sm">Advanced insights into your spending patterns</p>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <DollarSign className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Easy Tracking</h3>
                <p className="text-gray-600 text-sm">Effortless expense monitoring</p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Market Insights</h3>
                <p className="text-gray-600 text-sm">Real-time market analysis</p>
              </div>
              
              <div className="text-center p-6 bg-emerald-50 rounded-xl">
                <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Secure Data</h3>
                <p className="text-gray-600 text-sm">Bank-level security protection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Core Features</h2>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Financial Advisor</h3>
              <p className="text-gray-600 mb-6">
                Get personalized financial advice, AI-driven market predictions, and smart tips on managing your emergency fund based on your unique financial profile.
              </p>
              <button className="text-blue-600 font-semibold flex items-center hover:text-blue-700 transition-colors">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Intelligent Goal Planning</h3>
              <p className="text-gray-600 mb-6">
                Set and achieve your financial goals with AI-powered tracking, smart notifications, and personalized milestones tailored to your timeline.
              </p>
              <button className="text-blue-600 font-semibold flex items-center hover:text-blue-700 transition-colors">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Tracking</h3>
              <p className="text-gray-600 mb-6">
                Monitor your income and expenses with advanced AI algorithms. Get instant insights into your spending patterns.
              </p>
              <button className="text-purple-600 font-semibold flex items-center hover:text-purple-700 transition-colors">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Trusted by Users</h2>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-2xl">
              <p className="text-gray-700 mb-6 italic">
                "FuturePath AI has completely transformed how I manage my finances. The AI insights are incredibly accurate and..."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mr-4">
                  <span className="font-semibold text-blue-800">SJ</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-gray-600 text-sm">Small Business Owner</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-8 rounded-2xl">
              <p className="text-gray-700 mb-6 italic">
                "The smart tracking and goal planning features have helped me achieve my financial goals faster than ever before."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mr-4">
                  <span className="font-semibold text-blue-800">MC</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Michael Chen</p>
                  <p className="text-gray-600 text-sm">Software Engineer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-8 rounded-2xl">
              <p className="text-gray-700 mb-6 italic">
                "I love how intuitive the interface is. It's like having a personal financial advisor available 24/7."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mr-4">
                  <span className="font-semibold text-purple-800">ER</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Emily Rodriguez</p>
                  <p className="text-gray-600 text-sm">Marketing Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Let's Talk!</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-gray-900"
                  ></textarea>
                </div>
                
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-2 mt-5 ml-2 -mr-10">
      
                {/* The Frame Itself:
                    1. `p-1` provides padding that will become the border's thickness.
                    2. `bg-gradient-to-br` creates the gradient background.
                    3. `rounded-2xl` gives it soft, rounded corners.
                */}
                <div className="relative w-200 h-94 p-1 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl">
                    
                    {/* The Inner "Hollow" Area:
                    1. `bg-white` provides the solid fill. You can change this to any color, 
                        like `bg-gray-900` for a dark mode theme.
                    2. `h-full` and `w-full` make it fill the parent container.
                    3. `rounded-[14px]` is slightly smaller than the parent's `rounded-2xl`
                        to ensure the border width is consistent.
                    */}
                    <div className="w-full h-full bg-white rounded-[14px] overflow-hidden">
                        <video
                            src={contact}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        ></video>
                    </div>
                </div>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">FuturePath AI</div>
            <p className="text-blue-200 mb-8">© 2024 FuturePath AI. All Rights Reserved.</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}