import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, ShieldCheck, Loader2, User, FileText, Code, Briefcase, Layout, Mail } from 'lucide-react';

import HeroTab from './tabs/HeroTab';
import AboutTab from './tabs/AboutTab';
import SkillsTab from './tabs/SkillsTab';
import ProjectsTab from './tabs/ProjectsTab';
import ExperienceTab from './tabs/ExperienceTab';
import MessagesTab from './tabs/MessagesTab';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hero');
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token and fetch data on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchData = async () => {
      try {
        // We use the public endpoint to load current data for the admin to see
        const response = await axios.get('http://localhost:5000/api/portfolio');
        setPortfolioData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Called by child tabs when they successfully save data to the backend
  // We use this to instantly reflect their changes in the parent state without a full page reload!
  const handleUpdate = (section, newData) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: newData
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center text-primary-500">
        <Loader2 size={48} className="animate-spin mb-4" />
        <p className="font-mono text-gray-400">Loading Dashboard Data...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'hero', label: 'Hero', icon: <User size={18} /> },
    { id: 'about', label: 'About', icon: <FileText size={18} /> },
    { id: 'skills', label: 'Skills', icon: <Code size={18} /> },
    { id: 'projects', label: 'Projects', icon: <Layout size={18} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={18} /> },
    { id: 'messages', label: 'Messages', icon: <Mail size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-gray-200">
      
      {/* Admin Navbar */}
      <nav className="bg-dark-800 border-b border-dark-700 py-4 px-6 sm:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <ShieldCheck size={28} className="text-primary-500" />
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors border border-transparent hover:border-dark-600 bg-transparent hover:bg-dark-700 px-3 py-1.5 rounded-lg"
        >
          <LogOut size={16} /> Logout
        </button>
      </nav>

      {/* Main Layout Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar / Tabs Navigation */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4 sticky top-24 shadow-xl">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-3">Content Sections</h2>
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id 
                      ? 'bg-primary-600/10 text-primary-400 shadow-sm' 
                      : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                  }`}
                >
                  <span className={`${activeTab === tab.id ? 'text-primary-500' : 'text-gray-500'}`}>
                     {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </nav>
            
            <div className="mt-8 pt-6 border-t border-dark-700 px-3">
              <p className="text-xs text-gray-500 leading-relaxed">
                 Any changes you <b>Save</b> will instantly update the public portfolio website database.
              </p>
            </div>
          </div>
        </aside>

        {/* Tab Content Rendering Area */}
        <section className="flex-1 min-w-0">
           {activeTab === 'hero' && <HeroTab initialData={portfolioData.hero} onUpdate={handleUpdate} />}
           {activeTab === 'about' && <AboutTab initialData={portfolioData.about} onUpdate={handleUpdate} />}
           {activeTab === 'skills' && <SkillsTab initialData={portfolioData.skills} onUpdate={handleUpdate} />}
           {activeTab === 'projects' && <ProjectsTab initialData={portfolioData.projects} onUpdate={handleUpdate} />}
           {activeTab === 'experience' && <ExperienceTab initialData={portfolioData.experience} onUpdate={handleUpdate} />}
           {activeTab === 'messages' && <MessagesTab />}
        </section>

      </main>
    </div>
  );
};

export default Dashboard;
