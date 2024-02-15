import React, { useState } from 'react';
import "./JobCard.css";

export default function JobCard({ job, isSelected, onSelectJob }) {

  const handleClick = () => {
    onSelectJob(job);
  };

  return (
    <div
      onClick={handleClick}
      className={`max-w-xl mx-auto bg-white shadow-md rounded-lg overflow-hidden md:flex w-full transition-all duration-50 transform hover:scale-105 ${
        isSelected ? 'border-8 border-gradient' : ''
      }`}
      style={{ height: isSelected ? 'auto' : 'fit-content' }}
    >
      <div className="md:flex-shrink-0">
        <img className="h-48 w-full object-cover md:w-48" src={job.image} alt={job.title} />
      </div>
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{job.title}</div>
        <p className="mt-2 text-gray-600">
          <span className="font-semibold">Material: </span><span className="font-normal">{job.material}</span>
        </p>
        <p className="mt-2 text-gray-600">
          <span className="font-semibold">Infill: </span><span className="font-normal">{job.infill}</span>
        </p>
      </div>
    </div>
  );
}
