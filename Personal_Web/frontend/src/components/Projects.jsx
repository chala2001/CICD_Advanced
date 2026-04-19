import React from 'react';
import SectionHeader from './SectionHeader';
import { Github, ExternalLink, Cpu } from 'lucide-react';

const Projects = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section id="projects" className="section-container">
      <SectionHeader 
        title="Featured Projects" 
        subtitle="Some of the recent systems and applications I've built."
      />

      <div className="grid grid-cols-1 gap-12">
        {data.map((project) => (
          <div 
            key={project.id}
            className="group flex flex-col md:flex-row gap-8 glass-card overflow-hidden"
          >
            {/* Project Image / Architecture Diagram */}
            <div className="md:w-5/12 relative overflow-hidden bg-dark-900 border-b md:border-b-0 md:border-r border-dark-700 flex items-center justify-center min-h-[250px] group-hover:bg-dark-800 transition-colors">
               {project.architecture_image ? (
                 <img 
                    src={project.architecture_image.startsWith('/') ? `http://backend-service:5000${project.architecture_image}` : project.architecture_image} 
                    alt={`${project.title} Preview`}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                 />
               ) : (
                 <>
                   <Cpu size={64} className="text-dark-700 group-hover:text-primary-500/20 transition-colors duration-500" />
                   <div className="absolute bottom-4 left-4 right-4 text-center">
                       <p className="text-xs font-mono text-gray-500">[No Image Provided]</p>
                   </div>
                 </>
               )}
            </div>

            {/* Project Details */}
            <div className="md:w-7/12 p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                {project.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.tech_stack.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-primary-500/10 text-primary-400 text-xs font-mono rounded-full border border-primary-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 mt-auto">
                {project.github_link && (
                  <a 
                    href={project.github_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white bg-dark-700 hover:bg-dark-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Github size={16} /> Code
                  </a>
                )}
                
                {project.live_demo && project.live_demo !== "" && (
                  <a 
                    href={project.live_demo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-white hover:text-white bg-primary-600 hover:bg-primary-500 px-4 py-2 rounded-lg transition-colors"
                  >
                    <ExternalLink size={16} /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
