import React, { useState } from 'react';
import SectionHeader from './SectionHeader';
import { Send, Mail, Github, Linkedin, Loader2 } from 'lucide-react';
import axios from 'axios';

const Contact = ({ data }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // Send POST request to the backend API we built in Phase 1
      await axios.post('http://backend-service:5000/api/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' }); // Clear form
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  if (!data) return null;

  return (
    <section id="contact" className="section-container bg-dark-800/50">
      <SectionHeader 
        title="Get In Touch" 
        subtitle="Have a question or want to work together? Drop me a message below."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Let's Connect</h3>
          <p className="text-gray-400 mb-8 max-w-md whitespace-pre-line">
            {data.contact_text || "I'm currently seeking new opportunities... Reach out below!"}
          </p>
          
          <div className="flex flex-col gap-6">
            {data.email && (
              <a href={`mailto:${data.email}`} className="flex items-center gap-4 text-gray-300 hover:text-primary-500 transition-colors w-fit">
                <div className="w-12 h-12 bg-dark-700 rounded-full flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <span className="font-medium">{data.email}</span>
              </a>
            )}
            
            {data.linkedin_link && (
              <a href={data.linkedin_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-300 hover:text-primary-500 transition-colors w-fit">
                <div className="w-12 h-12 bg-dark-700 rounded-full flex items-center justify-center">
                  <Linkedin size={20} />
                </div>
                {/* Dynamically strip https:// to display a clean URL if desired, or just show the whole thing */}
                <span className="font-medium">{data.linkedin_link.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </a>
            )}

            {data.github_link && (
              <a href={data.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-300 hover:text-primary-500 transition-colors w-fit">
                <div className="w-12 h-12 bg-dark-700 rounded-full flex items-center justify-center">
                  <Github size={20} />
                </div>
                <span className="font-medium">{data.github_link}</span>
              </a>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all shadow-inner"
              placeholder="John Doe"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all shadow-inner"
              placeholder="john@example.com"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
            <textarea 
              id="message" 
              name="message" 
              required
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all shadow-inner resize-none"
              placeholder="Your message here..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-600/50 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-lg transition-colors"
          >
            {status === 'loading' ? (
              <><Loader2 size={20} className="animate-spin" /> Sending...</>
            ) : (
              <><Send size={20} /> Send Message</>
            )}
          </button>

          {status === 'success' && (
            <p className="mt-4 text-center text-green-400 text-sm font-medium">Message sent successfully!</p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-center text-red-500 text-sm font-medium">Failed to send message. Please try again.</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;
