import React from 'react'

// TODO: replace with job data
export default function JobCard({title, description, image}) {
  return (
    <div className="w-full bg-white shadow-xl rounded-lg hover:scale-105 duration-300">
      <img className="w-full h-48 object-cover rounded-t-lg" src={image} alt="Card" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  )
}
