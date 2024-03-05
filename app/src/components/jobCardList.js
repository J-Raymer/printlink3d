import { ref } from '@firebase/storage';
import JobCard from './jobCard'
import React, {useState, useEffect, useRef} from 'react';

export default function JobCardList({ jobs, filters, selectedJob, onSelectJob, onUnselectJob }) {

  const [jobList, setJobList] = useState(<></>);

  function refreshJobList() {
    setJobList(jobs.map((job) => {
      if (filters["materials"].includes(job.material)) {
        return ( <JobCard
          job={job}
          isSelected={selectedJob===job}
          onSelectJob={(job) => onSelectJob(job)}
          onUnselectJob={onUnselectJob}
        />);
      }
    }));
  }

  useEffect(() => {
    refreshJobList();
  }, []);

  useEffect(() => {
    refreshJobList();
  }, [filters, jobs]);

  return (
    <div className=''>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {jobList}
      </div>
    </div>
  )
}
