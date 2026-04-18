import React from 'react';
import SectionHeader from './SectionHeader';

const Skills = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section id="skills" className="section-container bg-dark-800/50">
      <SectionHeader 
        title="Technical Skills" 
        subtitle="A snapshot of the languages, tools, and frameworks I use daily."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((skillGroup) => (
          <div 
            key={skillGroup.id} 
            className="glass-card rounded-xl p-8 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="text-xl font-bold text-white mb-6 flex justify-between items-center pb-4 border-b border-dark-700">
              {skillGroup.category}
              <span className="text-primary-500 text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity">&lt;{skillGroup.items.length}&gt;</span>
            </h3>
            
            <div className="flex flex-wrap gap-3">
              {skillGroup.items.map((item, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-dark-800 text-gray-300 text-sm font-medium rounded-lg border border-dark-700 hover:text-white hover:border-gray-500 transition-all cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
