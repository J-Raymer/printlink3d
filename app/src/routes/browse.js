import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import JobCardList from "../components/jobCardList";
import React, { useState } from 'react';
import { GetAllJobs } from "../backend";
import { firebaseDb } from "../firebase";

let jobs = await GetAllJobs(firebaseDb)
console.log(jobs);

export default function Browse() {
  const [selectedJob, setSelectedJob] = useState(null);

  const onSelectJob = (job) => {
    setSelectedJob(job);
  }

  const onUnselectJob = () => {
    setSelectedJob(null);
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold p-6 pl-4">Browse</h1>
      <MultiStepForm submitText="Accept Job" showNext={selectedJob !== null} validDetails={true}>
        <MultiStepFormPage title="Select Print">
          <div className="flex justify-center">
            <p className="text-4xl font-bold mb-10">Select a Job</p>
          </div>
          <JobCardList
            jobs={jobs}
            onSelectJob={onSelectJob}
            onUnselectJob={onUnselectJob}
            selectedJob={selectedJob}
          />
        </MultiStepFormPage>
        <MultiStepFormPage title="Confirm">
          <div className="flex justify-center">
            <p className="text-4xl font-bold">Confirm Job Selection</p>
          </div>
          <div className="text-3xl leading-loose">
            <p>Distance: {selectedJob !== null && selectedJob.distance}km</p>
            <p>Material: {selectedJob !== null && selectedJob.material}</p>
            <p>Infill: {selectedJob !== null && selectedJob.infill}%</p>
          </div>
        </MultiStepFormPage>
      </MultiStepForm>
    </div>
  );
}
