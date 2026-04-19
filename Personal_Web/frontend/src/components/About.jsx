import React from 'react';
import SectionHeader from './SectionHeader';
import { CheckCircle } from 'lucide-react';

const About = ({ data }) => {
  if (!data) return null;

  return (
    <section id="about" className="section-container relative">
      <div className="absolute right-0 top-32 w-72 h-72 bg-primary-600/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
        <div>
          <SectionHeader 
            title="About Me" 
            subtitle="My journey from microcontrollers to cloud infrastructure."
          />
          
          <div className="glass-card rounded-2xl p-8">
            <p className="text-gray-300 leading-relaxed text-lg mb-6">
              {data.story}
            </p>
            
            <h3 className="text-white text-xl font-semibold mb-4 border-b border-dark-700 pb-2">Key Interests</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.interests.map((interest, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-400">
                  <CheckCircle size={18} className="text-primary-500" />
                  <span>{interest}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Visual Element / Profile Photo */}
        <div className="hidden lg:flex items-center justify-center h-full">
          {data.profile_image ? (
              <img 
                src={data.profile_image.startsWith('/') ? `http://192.168.49.2:30007${data.profile_image}` : data.profile_image} 
                alt="Profile" 
                className="w-full max-w-md aspect-square rounded-2xl object-cover shadow-2xl border border-dark-700" 
              />
          ) : (
              <div className="relative w-full max-w-md aspect-square rounded-2xl bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 flex items-center justify-center overflow-hidden group">
                  {/* Decorative Elements */}
                  <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="w-3/4 h-3/4 border-2 border-primary-500/20 rounded-xl relative transform group-hover:rotate-6 transition-transform duration-500">
                      <div className="absolute -inset-4 border-2 border-dashed border-gray-600/30 rounded-xl transform -rotate-3"></div>
                  </div>
                  <span className="absolute text-gray-500 font-mono text-sm">[ Profile Image / Graphic ]</span>
              </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default About;
