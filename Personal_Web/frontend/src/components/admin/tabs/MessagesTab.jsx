import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Trash2, MailOpen, Calendar, Mail } from 'lucide-react';

const MessagesTab = () => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('loading'); // loading, idle, error

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
       const token = localStorage.getItem('adminToken');
       const response = await axios.get('http://192.168.49.2:30007/api/admin/messages', {
         headers: { Authorization: `Bearer ${token}` }
       });
       setMessages(response.data);
       setStatus('idle');
    } catch (err) {
       console.error("Error fetching messages:", err);
       setStatus('error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message? This action is permanent.")) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://192.168.49.2:30007/api/admin/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from UI
      setMessages(prev => prev.filter(msg => msg.id !== id));
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message.");
    }
  };

  if (status === 'loading') {
      return (
          <div className="flex items-center justify-center p-12 text-primary-500">
              <Loader2 size={32} className="animate-spin" />
          </div>
      );
  }

  if (status === 'error') {
      return (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl max-w-lg mx-auto text-center mt-12">
              Failed to load messages. Please ensure the backend is running and the database is connected.
          </div>
      );
  }

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-8 shadow-xl max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b border-dark-700 pb-4">
         <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <MailOpen size={20} className="text-primary-500" />
            Contact Form Messages
         </h3>
         <span className="text-sm font-medium text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
            {messages.length} Total
         </span>
      </div>

      <div className="space-y-4">
          {messages.length === 0 ? (
             <div className="text-center py-12 text-gray-500">
                 <MailOpen size={48} className="mx-auto mb-4 opacity-20" />
                 <p>Your inbox is empty. No messages yet.</p>
             </div>
          ) : (
              messages.map(msg => (
                  <div key={msg.id} className="bg-dark-900 border border-dark-600 rounded-lg p-5 transition-colors hover:border-dark-500">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                          <div>
                              <h4 className="text-lg font-bold text-white mb-1">{msg.name}</h4>
                              <a href={`mailto:${msg.email}`} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1.5 transition-colors">
                                  <Mail size={14} /> {msg.email}
                              </a>
                          </div>
                          <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Calendar size={12} /> 
                                  {new Date(msg.created_at).toLocaleString()}
                              </span>
                              <button 
                                onClick={() => handleDelete(msg.id)} 
                                className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                                title="Delete Message"
                              >
                                <Trash2 size={16} />
                              </button>
                          </div>
                      </div>
                      <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                          <p className="text-gray-300 text-sm whitespace-pre-wrap">{msg.message}</p>
                      </div>
                  </div>
              ))
          )}
      </div>
    </div>
  );
};

export default MessagesTab;
