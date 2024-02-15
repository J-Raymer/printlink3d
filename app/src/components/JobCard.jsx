import React from 'react';

export default function JobCard({ title, material, infill, image }) {
  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg overflow-hidden md:flex w-full">
      <div className="md:flex-shrink-0">
        <img className="h-48 w-full object-cover md:w-48" src={image} alt={title} />
      </div>
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{title}</div>
        <p className="mt-2 text-gray-600">
          <span className="font-semibold">Material:</span> <span className="font-normal">{material}</span>
        </p>
        <p className="mt-2 text-gray-600">
          <span className="font-semibold">Infill:</span> <span className="font-normal">{infill}</span>
        </p>
      </div>
    </div>
  );
}
