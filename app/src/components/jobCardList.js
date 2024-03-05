import JobCard from './jobCard'

export default function JobCardList({ jobs, selectedJob, onSelectJob, onUnselectJob }) {
  return (
    <div className=''>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <JobCard
            job={job}
            isSelected={selectedJob===job}
            onSelectJob={(job) => onSelectJob(job)}
            onUnselectJob={onUnselectJob}
          />
        ))}
      </div>
    </div>
  )
}
