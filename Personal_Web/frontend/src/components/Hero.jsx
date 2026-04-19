import React from 'react';
import { Github, Linkedin, FileText, ArrowRight } from 'lucide-react';

const Hero = ({ data }) => {
  if (!data) return null;

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 pb-12 px-6 sm:px-12 relative overflow-hidden">
      
      {/* Subtle Background Animated Glow Effects */}
      <div className="absolute top-10 left-10 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob"></div>
      <div className="absolute top-10 right-10 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-accent-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-primary-400/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-4000"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10 w-full animate-fade-in-up">
        {/* Name and Title */}
        <p className="text-primary-500 font-medium mb-4 tracking-widest uppercase text-sm md:text-base">
          Hello World, I'm
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-white">
          <span className="text-gradient drop-shadow-lg">{data.name}</span>
        </h1>
        <h2 className="text-xl md:text-3xl text-gray-300 font-medium mb-8 drop-shadow-md">
          {data.title}
        </h2>
        
        {/* Short Intro */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          {data.subtitle}
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a 
            href="#projects" 
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
          >
            View Projects <ArrowRight size={18} />
          </a>
          
          <a 
            href={data.cv_link?.startsWith('/') ? `http://192.168.49.2:30007${data.cv_link}` : data.cv_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-dark-700 hover:bg-dark-600 text-gray-200 border border-dark-600 hover:border-gray-500 px-8 py-3.5 rounded-lg font-medium transition-all"
          >
            <FileText size={18} /> Download CV
          </a>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-6 mt-16">
          <a href={data.github_link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-dark-800 rounded-full">
            <Github size={24} />
            <span className="sr-only">GitHub</span>
          </a>
          <a href={data.linkedin_link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-dark-800 rounded-full">
            <Linkedin size={24} />
            <span className="sr-only">LinkedIn</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
