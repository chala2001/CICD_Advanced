import React from 'react';

const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <div className="w-20 h-1 bg-primary-500 rounded-full mb-6"></div>
      )}
      {subtitle && (
        <p className="text-gray-400 max-w-2xl text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
