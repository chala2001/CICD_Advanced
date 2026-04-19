import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, Save } from 'lucide-react';
import FileUpload from '../FileUpload'; // Import our new component

const HeroTab = ({ initialData, onUpdate }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '', title: '', subtitle: '', github_link: '', linkedin_link: '', cv_link: ''
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle successful file upload
  const handleFileUploadSuccess = (url) => {
    setFormData({ ...formData, cv_link: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put('http://192.168.49.2:30007/api/admin/hero', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus('success');
      onUpdate('hero', response.data);
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Error updating hero:', err);
      setStatus('error');
    }
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-6 border-b border-dark-700 pb-4">Edit Hero Section & CV</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* CV Upload */}
        <FileUpload 
          label="Downloadable CV / Resume (PDF format recommended)" 
          currentFileUrl={formData.cv_link}
          onUploadSuccess={handleFileUploadSuccess}
          accept=".pdf,.doc,.docx"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-dark-700">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Professional Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle / Short Intro</label>
          <textarea name="subtitle" rows="3" value={formData.subtitle} onChange={handleChange} required className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-y"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Contact Section Description</label>
          <textarea name="contact_text" rows="3" value={formData.contact_text || ''} onChange={handleChange} required className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-y"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
            <input type="url" name="github_link" value={formData.github_link} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn URL</label>
            <input type="url" name="linkedin_link" value={formData.linkedin_link} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button type="submit" disabled={status === 'loading'} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-600/50 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
            {status === 'loading' ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
          </button>
          {status === 'success' && <span className="text-green-400 text-sm font-medium">Hero updated successfully!</span>}
          {status === 'error' && <span className="text-red-500 text-sm font-medium">Failed to update.</span>}
        </div>
      </form>
    </div>
  );
};

export default HeroTab;
