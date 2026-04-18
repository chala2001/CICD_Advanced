import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, Save } from 'lucide-react';
import FileUpload from '../FileUpload'; // Import our new component

const AboutTab = ({ initialData, onUpdate }) => {
  const [formData, setFormData] = useState({
    story: initialData?.story || '',
    interests: initialData?.interests ? initialData.interests.join(', ') : '',
    profile_image: initialData?.profile_image || '' // Add profile image to state
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle successful file upload
  const handleFileUploadSuccess = (url) => {
    setFormData({ ...formData, profile_image: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const interestsArray = formData.interests.split(',').map(i => i.trim()).filter(Boolean);
      // Include profile_image in payload
      const payload = { story: formData.story, interests: interestsArray, profile_image: formData.profile_image };
      const token = localStorage.getItem('adminToken');
      
      const response = await axios.put('http://localhost:5000/api/admin/about', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStatus('success');
      onUpdate('about', response.data);
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Error updating about:', err);
      setStatus('error');
    }
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-6 border-b border-dark-700 pb-4">Edit About Me & Profile Photo</h3>
      
      {/* Upload Zone for Profile Photo */}
      <FileUpload 
          label="Profile Photo (Displayed next to your story)" 
          currentFileUrl={formData.profile_image}
          onUploadSuccess={handleFileUploadSuccess}
          accept="image/*"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">My Story</label>
          <textarea 
            name="story" 
            rows="6" 
            value={formData.story} 
            onChange={handleChange} 
            required 
            className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-y"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Interests (Comma separated)</label>
          <input 
            type="text" 
            name="interests" 
            value={formData.interests} 
            onChange={handleChange} 
            required 
            placeholder="Cloud, IoT, DevOps"
            className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" 
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button type="submit" disabled={status === 'loading'} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-600/50 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
            {status === 'loading' ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
          </button>
          {status === 'success' && <span className="text-green-400 text-sm font-medium">About section updated successfully!</span>}
          {status === 'error' && <span className="text-red-500 text-sm font-medium">Failed to update.</span>}
        </div>
      </form>
    </div>
  );
};

export default AboutTab;
