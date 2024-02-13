import React, {useState, useEffect} from 'react'
import JobCard from './JobCard'

// TODO:
export default function JobCardList({jobs}) {

  return (
    <div className='mx-auto'>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {jobs.map((job) => (
      <JobCard
        key={job.id}
        title={job.title}
        description={job.description}
        image={job.image}
      />
    ))}
  </div>
  </div>
  )
}
