import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, User, Loader2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, error
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await axios.post('http://192.168.49.2:30007/api/auth/login', formData);
      
      // Save the JWT token to localStorage
      localStorage.setItem('adminToken', response.data.token);
      
      setStatus('idle');
      // Redirect to the protected dashboard
      navigate('/admin/dashboard');
      
    } catch (err) {
      console.error('Login error:', err);
      setStatus('error');
      setErrorMessage(err.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary-600/20 blur-[50px] rounded-full"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-dark-900 border border-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
          <p className="text-gray-400 text-sm">Protected area. Authorized personnel only.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full bg-dark-900 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-dark-900 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {status === 'error' && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-600/50 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-lg transition-colors shadow-lg shadow-primary-500/20"
          >
            {status === 'loading' ? (
              <><Loader2 size={18} className="animate-spin" /> Authenticating...</>
            ) : (
              'Login to Dashboard'
            )}
          </button>
          
          <div className="mt-6 text-center">
             <a href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                 &larr; Back to Portfolio
             </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
