import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, PlusCircle, Edit2, Trash2, Save, X } from 'lucide-react';

const SkillsTab = ({ initialData, onUpdate }) => {
  const [skills, setSkills] = useState(initialData || []);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState({ id: null, category: '', items: '' });
  const [status, setStatus] = useState('idle');

  const handleEdit = (skill) => {
    setCurrentSkill({
      id: skill.id,
      category: skill.category,
      items: skill.items.join(', ')
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentSkill({ id: null, category: '', items: '' });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentSkill({ id: null, category: '', items: '' });
    setStatus('idle');
  };

  const handleChange = (e) => setCurrentSkill({ ...currentSkill, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const itemsArray = currentSkill.items.split(',').map(i => i.trim()).filter(Boolean);
    const payload = { category: currentSkill.category, items: itemsArray };
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (currentSkill.id) {
        // Update
        const res = await axios.put(`http://192.168.49.2:30007/api/admin/skills/${currentSkill.id}`, payload, config);
        const updatedSkills = skills.map(s => s.id === currentSkill.id ? res.data : s);
        setSkills(updatedSkills);
        onUpdate('skills', updatedSkills);
      } else {
        // Create
        const res = await axios.post(`http://192.168.49.2:30007/api/admin/skills`, payload, config);
        const newSkills = [...skills, res.data];
        setSkills(newSkills);
        onUpdate('skills', newSkills);
      }
      setStatus('success');
      setTimeout(() => handleCancel(), 1500);
    } catch (err) {
      console.error('Error saving skill:', err);
      setStatus('error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://192.168.49.2:30007/api/admin/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const filtered = skills.filter(s => s.id !== id);
      setSkills(filtered);
      onUpdate('skills', filtered);
    } catch (err) {
      console.error("Error deleting skill:", err);
      alert("Failed to delete.");
    }
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto">
      
      {!isEditing ? (
        <>
          <div className="flex justify-between items-center mb-6 border-b border-dark-700 pb-4">
            <h3 className="text-xl font-bold text-white">Manage Skills</h3>
            <button onClick={handleAddNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm">
              <PlusCircle size={16} /> Add Category
            </button>
          </div>

          <div className="space-y-4">
            {skills.map(skill => (
              <div key={skill.id} className="flex justify-between items-start bg-dark-900 border border-dark-600 rounded-lg p-5">
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">{skill.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map(item => (
                      <span key={item} className="bg-dark-800 border border-dark-600 px-3 py-1 rounded-full text-xs text-gray-300">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(skill)} className="p-2 text-gray-400 hover:text-white bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors border border-dark-600">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(skill.id)} className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {skills.length === 0 && <p className="text-gray-500 text-center py-4">No skills found.</p>}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center mb-6 border-b border-dark-700 pb-4">
            <h3 className="text-xl font-bold text-white">{currentSkill.id ? 'Edit Category' : 'Add New Category'}</h3>
            <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category Name</label>
            <input type="text" name="category" value={currentSkill.category} onChange={handleChange} required placeholder="e.g. Frontend" className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Skills (Comma separated)</label>
            <input type="text" name="items" value={currentSkill.items} onChange={handleChange} required placeholder="React, Vue, Tailwind" className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>

          <div className="flex items-center gap-4 pt-4">
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

export default SkillsTab;
