import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/body_bg.svg';
import authService from '../services/authService';

const LoginSignupComponent = () => {
  const [signInMode, setSignInMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const toggleMode = () => {
    setSignInMode(!signInMode);
    setError('');
    setSuccess('');
    setFormData({ name: '', email: '', password: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (signInMode) {
        // Login
        const response = await authService.login(formData.email, formData.password);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/main-dashboard');
        }, 1000);
      } else {
        // Signup
        const response = await authService.register(formData.name, formData.email, formData.password);
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/main-dashboard');
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-4xl min-h-[500px] relative">
        
        {/* Error/Success Messages */}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Sign Up Container */}
        <div className={`absolute top-0 h-full transition-all duration-500 ease-in-out left-0 w-1/2 ${
          signInMode ? 'opacity-0 z-10' : 'transform translate-x-full opacity-100 z-50'
        }`}>
          <form onSubmit={handleSubmit} className="bg-white flex items-center justify-center flex-col px-12 h-full text-center">
            <h1 className="font-bold text-green-800 text-2xl mb-6">Create Account</h1>
            <input 
              type="text" 
              name="name"
              placeholder="Name" 
              value={formData.name}
              onChange={handleInputChange}
              className="bg-gray-200 py-3 px-4 my-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              value={formData.email}
              onChange={handleInputChange}
              className="bg-gray-200 py-3 px-4 my-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleInputChange}
              className="bg-gray-200 py-3 px-4 my-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
            <button 
              type="submit"
              disabled={loading}
              className="rounded-full border border-green-800 bg-green-800 text-white text-xs font-bold py-3 px-11 mt-4 tracking-wide uppercase hover:bg-green-700 active:scale-95 transition-transform duration-75 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* Sign In Container */}
        <div className={`absolute top-0 h-full transition-all duration-500 ease-in-out left-0 w-1/2 z-20 ${
          signInMode ? '' : 'transform translate-x-full'
        }`}>
          <form onSubmit={handleSubmit} className="bg-white flex items-center justify-center flex-col px-12 h-full text-center">
            <h1 className="font-bold text-green-800 text-2xl mb-6">Sign In</h1>
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              value={formData.email}
              onChange={handleInputChange}
              className="bg-gray-200 py-3 px-4 my-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleInputChange}
              className="bg-gray-200 py-3 px-4 my-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
            <a href="#" className="text-gray-600 text-sm my-4 hover:text-gray-800">Forgot your password?</a>
            <button 
              type="submit"
              disabled={loading}
              className="rounded-full border border-green-800 bg-green-800 text-white text-xs font-bold py-3 px-11 tracking-wide uppercase hover:bg-green-700 active:scale-95 transition-transform duration-75 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Overlay */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-500 ease-in-out z-[100] ${
          signInMode ? '' : 'transform -translate-x-full'
        }`}>
          <div
            style={{ backgroundImage: `url(${bgImage})` }}
            className={`bg-cover bg-center text-green-800 relative -left-full h-full w-[200%] transition-transform duration-500 ease-in-out ${
              signInMode ? 'translate-x-0' : 'translate-x-1/2'
            }`}
          >

            {/* Left Overlay */}
            <div className={`absolute flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 transition-transform duration-500 ease-in-out ${
              signInMode ? '-translate-x-1/5' : 'translate-x-0'
            }`}>
              <h1 className="font-bold text-4xl mb-2">Welcome Back!</h1>
              <p className="text-lg font-[25px] leading-5 my-5 mb-8">
                Sign in to unlock your smart AI finance dashboard!
              </p>
              <button
                onClick={toggleMode}
                className="rounded-full border border-white bg-transparent text-white text-xs font-bold py-3 px-11 tracking-wide uppercase hover:bg-white hover:text-green-800 active:scale-95 transition-transform duration-75"
              >
                Sign In
              </button>
            </div>

            {/* Right Overlay */}
            <div className={`absolute flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 right-0 transition-transform duration-500 ease-in-out ${
              signInMode ? 'translate-x-0' : 'translate-x-1/5'
            }`}>
              <h1 className="font-bold text-4xl mb-2">Hello, Friend!</h1>
              <p className="text-lg font-[25px] leading-5 my-5 mb-8">
                Enter your personal details and start your journey with us!
              </p>
              <button
                onClick={toggleMode}
                className="rounded-full border border-white bg-transparent text-white text-xs font-bold py-3 px-11 tracking-wide uppercase hover:bg-white hover:text-green-800 active:scale-95 transition-transform duration-75"
              >
                Sign Up
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginSignupComponent;
