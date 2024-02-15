import React, { useState } from 'react'
import JobCard from './JobCard'

export default function JobCardList({ jobs, selectedJob, onSelectJob }) {
  return (
    <div className='mx-auto'>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard
            job={job}
            isSelected={selectedJob===job}
            onSelectJob={(job) => onSelectJob(job)}
          />
        ))}
      </div>
    </div>
  )
}
