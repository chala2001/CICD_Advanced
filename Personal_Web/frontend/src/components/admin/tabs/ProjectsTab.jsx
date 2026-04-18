import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, PlusCircle, Edit2, Trash2, Save, X, ExternalLink, Github } from 'lucide-react';
import FileUpload from '../FileUpload'; // Extracted reusable Dropzone

const ProjectsTab = ({ initialData, onUpdate }) => {
  const [projects, setProjects] = useState(initialData || []);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState({ 
    id: null, title: '', description: '', tech_stack: '', github_link: '', live_demo: '', architecture_image: '' 
  });
  const [status, setStatus] = useState('idle');

  const handleEdit = (project) => {
    setCurrentProject({
      ...project,
      tech_stack: project.tech_stack.join(', ')
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProject({ id: null, title: '', description: '', tech_stack: '', github_link: '', live_demo: '', architecture_image: '' });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentProject({ id: null, title: '', description: '', tech_stack: '', github_link: '', live_demo: '', architecture_image: '' });
    setStatus('idle');
  };

  const handleChange = (e) => setCurrentProject({ ...currentProject, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const techArray = currentProject.tech_stack.split(',').map(i => i.trim()).filter(Boolean);
    const payload = { ...currentProject, tech_stack: techArray };
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (currentProject.id) {
        // Update
        const res = await axios.put(`http://localhost:5000/api/admin/projects/${currentProject.id}`, payload, config);
        const updatedProjects = projects.map(p => p.id === currentProject.id ? res.data : p);
        setProjects(updatedProjects);
        onUpdate('projects', updatedProjects);
      } else {
        // Create
        const res = await axios.post(`http://localhost:5000/api/admin/projects`, payload, config);
        const newProjects = [...projects, res.data];
        setProjects(newProjects);
        onUpdate('projects', newProjects);
      }
      setStatus('success');
      setTimeout(() => handleCancel(), 1500);
    } catch (err) {
      console.error('Error saving project:', err);
      setStatus('error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const filtered = projects.filter(p => p.id !== id);
      setProjects(filtered);
      onUpdate('projects', filtered);
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete.");
    }
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-8 shadow-xl max-w-5xl mx-auto">
      
      {!isEditing ? (
        <>
          <div className="flex justify-between items-center mb-6 border-b border-dark-700 pb-4">
            <h3 className="text-xl font-bold text-white">Manage Projects</h3>
            <button onClick={handleAddNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm">
              <PlusCircle size={16} /> Add Project
            </button>
          </div>

          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-dark-900 border border-dark-600 rounded-lg p-5 gap-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-1">{project.title}</h4>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex items-center gap-3">
                    {project.github_link && <a href={project.github_link} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white"><Github size={16} /></a>}
                    {project.live_demo && <a href={project.live_demo} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white"><ExternalLink size={16} /></a>}
                    <div className="flex flex-wrap gap-1 ml-2 border-l border-dark-700 pl-4">
                      {project.tech_stack.slice(0, 3).map(t => <span key={t} className="text-xs text-primary-400">{t}</span>)}
                      {project.tech_stack.length > 3 && <span className="text-xs text-gray-500">+{project.tech_stack.length - 3} more</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(project)} className="p-2 text-gray-400 hover:text-white bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors border border-dark-600">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-gray-500 text-center py-4">No projects found.</p>}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center mb-6 border-b border-dark-700 pb-4">
            <h3 className="text-xl font-bold text-white">{currentProject.id ? 'Edit Project' : 'Add New Project'}</h3>
            <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project Title *</label>
              <input type="text" name="title" value={currentProject.title} onChange={handleChange} required className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tech Stack (Comma separated) *</label>
              <input type="text" name="tech_stack" value={currentProject.tech_stack} onChange={handleChange} required placeholder="React, Node.js, Docker" className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
            <textarea name="description" rows="4" value={currentProject.description} onChange={handleChange} required className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-y"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-gray-300 mb-2">GitHub Link</label>
               <input type="url" name="github_link" value={currentProject.github_link || ''} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-300 mb-2">Live Demo Link</label>
               <input type="url" name="live_demo" value={currentProject.live_demo || ''} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
          </div>
          
          <div className="mt-6">
              <FileUpload 
                  label="Project Architecture / Thumbnail Image" 
                  currentFileUrl={currentProject.architecture_image}
                  onUploadSuccess={(url) => setCurrentProject({ ...currentProject, architecture_image: url })}
                  accept="image/*"
              />
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

export default ProjectsTab;
