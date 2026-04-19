import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, PlusCircle, Edit2, Trash2, Save, X } from 'lucide-react';

const ExperienceTab = ({ initialData, onUpdate }) => {
  const [experiences, setExperiences] = useState(initialData || []);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExp, setCurrentExp] = useState({ 
    id: null, title: '', company: '', description: '', timeframe: '' 
  });
  const [status, setStatus] = useState('idle');

  const handleEdit = (exp) => {
    setCurrentExp(exp);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentExp({ id: null, title: '', company: '', description: '', timeframe: '' });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentExp({ id: null, title: '', company: '', description: '', timeframe: '' });
    setStatus('idle');
  };

  const handleChange = (e) => setCurrentExp({ ...currentExp, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (currentExp.id) {
        // Update
        const res = await axios.put(`http://backend-service:5000/api/admin/experience/${currentExp.id}`, currentExp, config);
        const updatedExps = experiences.map(e => e.id === currentExp.id ? res.data : e);
        setExperiences(updatedExps);
        onUpdate('experience', updatedExps);
      } else {
        // Create
        const res = await axios.post(`http://backend-service:5000/api/admin/experience`, currentExp, config);
        const newExps = [...experiences, res.data];
        setExperiences(newExps);
        onUpdate('experience', newExps);
      }
      setStatus('success');
      setTimeout(() => handleCancel(), 1500);
    } catch (err) {
      console.error('Error saving experience:', err);
      setStatus('error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://backend-service:5000/api/admin/experience/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const filtered = experiences.filter(e => e.id !== id);
      setExperiences(filtered);
      onUpdate('experience', filtered);
    } catch (err) {
      console.error("Error deleting experience:", err);
      alert("Failed to delete.");
    }
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto">
      
      {!isEditing ? (
        <>
          <div className="flex justify-between items-center mb-6 border-b border-dark-700 pb-4">
            <h3 className="text-xl font-bold text-white">Manage Experience</h3>
            <button onClick={handleAddNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm">
              <PlusCircle size={16} /> Add Role
            </button>
          </div>

          <div className="space-y-4">
            {experiences.map(exp => (
              <div key={exp.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-dark-900 border border-dark-600 rounded-lg p-5 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-lg font-bold text-white">{exp.title}</h4>
                    <span className="text-sm px-2 py-0.5 rounded bg-dark-700 text-gray-300">{exp.timeframe}</span>
                  </div>
                  <p className="text-primary-400 font-medium text-sm mb-2">{exp.company}</p>
                  <p className="text-sm text-gray-400 line-clamp-2">{exp.description}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(exp)} className="p-2 text-gray-400 hover:text-white bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors border border-dark-600">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(exp.id)} className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {experiences.length === 0 && <p className="text-gray-500 text-center py-4">No experience found.</p>}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center mb-6 border-b border-dark-700 pb-4">
            <h3 className="text-xl font-bold text-white">{currentExp.id ? 'Edit Role' : 'Add New Role'}</h3>
            <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
              <input type="text" name="title" value={currentExp.title} onChange={handleChange} required className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company *</label>
              <input type="text" name="company" value={currentExp.company} onChange={handleChange} required className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
            <textarea name="description" rows="4" value={currentExp.description} onChange={handleChange} required className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-y"></textarea>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-300 mb-2">Timeframe *</label>
             <input type="text" name="timeframe" value={currentExp.timeframe} onChange={handleChange} required placeholder="e.g. May 2025 - Aug 2025" className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none max-w-md" />
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-dark-700">
            <button type="submit" disabled={status === 'loading'} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-600/50 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
              {status === 'loading' ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save</>}
            </button>
            <button type="button" onClick={handleCancel} className="bg-dark-900 border border-dark-600 hover:border-gray-500 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
              Cancel
            </button>
            {status === 'success' && <span className="text-green-400 text-sm font-medium">Saved successfully!</span>}
            {status === 'error' && <span className="text-red-500 text-sm font-medium">Error saving data.</span>}
          </div>
        </form>
      )}
    </div>
  );
};

export default ExperienceTab;
