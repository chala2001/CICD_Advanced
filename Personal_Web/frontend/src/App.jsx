import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

// Public Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';

// Admin Components
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';

// A wrapper component to securely guard the Dashboard route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// Extracted the public portfolio view into its own component
const PortfolioView = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/portfolio');
        setPortfolioData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load portfolio data. Is the backend running?');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center text-primary-500">
        <Loader2 size={48} className="animate-spin mb-4" />
        <p className="font-mono text-gray-400">Loading Portfolio Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center text-red-500 font-mono px-6 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero data={portfolioData.hero} />
        <About data={portfolioData.about} />
        <Skills data={portfolioData.skills} />
        <Projects data={portfolioData.projects} />
        <Experience data={portfolioData.experience} />
        <Contact data={portfolioData.hero} />
      </main>
      <footer className="bg-dark-900 border-t border-dark-800 py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} {portfolioData.hero?.name}. Built with React & Node.js.</p>
      </footer>
    </>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-dark-900 text-gray-200">
      <BrowserRouter>
        <Routes>
          {/* Public Portfolio Route */}
          <Route path="/" element={<PortfolioView />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all to redirect unknown paths to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
