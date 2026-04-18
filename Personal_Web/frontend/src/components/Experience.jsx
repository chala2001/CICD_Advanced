import React from 'react';
import SectionHeader from './SectionHeader';
import { Briefcase } from 'lucide-react';

const Experience = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section id="experience" className="section-container relative">
      <SectionHeader 
        title="Experience" 
        subtitle="Where I've applied my skills in the real world."
      />

      <div className="max-w-4xl mx-auto border-l border-dark-700 ml-4 md:ml-auto">
        {data.map((job) => (
          <div key={job.id} className="relative pl-8 pb-12 last:pb-0 group">
            {/* Timeline Dot */}
            <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-dark-700 border border-dark-600 group-hover:bg-primary-500 group-hover:border-primary-400 transition-colors"></div>
            
            <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 hover:bg-dark-800 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase size={20} className="text-primary-500 hidden md:block" />
                  {job.title}
                </h3>
                <span className="text-sm font-mono text-primary-500 mt-1 md:mt-0">{job.timeframe}</span>
              </div>
              
              <h4 className="text-lg text-gray-300 mb-4">{job.company}</h4>
              <p className="text-gray-400 leading-relaxed">
                {job.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
