import React from 'react';

export default function JobCard({ title, description, image }) {
  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg overflow-hidden md:flex">
      <div className="md:flex-shrink-0">
        <img className="h-48 w-full object-cover md:w-48" src={image} alt={title} />
      </div>
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{title}</div>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
    </div>
  );
}