import JobCard from './jobCard'

export default function JobCardList({ jobs, filters, selectedJob, onSelectJob, onUnselectJob }) {
  return (
    <div className=''>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {
        jobs.map((job, i) => {
        if ((filters["materials"].includes(job.material) || job.material == "Plastic") &&
            (filters["colors"].includes(job.color) || job.color == "No Preference")){
          return ( <JobCard
            key={"jobcard-"+i}
            job={job}
            isSelected={selectedJob===job}
            onSelectJob={onSelectJob}
            onUnselectJob={onUnselectJob}
          />);
        }})
      }
      </div>
    </div>
  );
}
