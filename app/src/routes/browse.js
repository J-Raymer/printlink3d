import { Link } from "react-router-dom";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import JobCardList from "../components/JobCardList";
import React, { useState } from 'react';

let tempJobs = [
  {
    id: 1,
    title: "boat",
    infill: "25%",
    material: "PLA",
    image: "https://picsum.photos/200/300",
  },
  {
    id: 2,
    title: "boat",
    infill: "25%",
    material: "PLA",
    image: "https://picsum.photos/200/300",
  },
  {
    id: 3,
    title: "boat",
    infill: "25%",
    material: "PLA",
    image: "https://picsum.photos/200/300",
  },
  {
    id: 4,
    title: "boat",
    infill: "25%",
    material: "PLA",
    image: "https://picsum.photos/200/300",
  },
];

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
      <MultiStepForm submitText="Accept Job" showNext={selectedJob !== null}>
        <MultiStepFormPage title="Select Print">
          <div className="flex justify-center">
            <p className="text-4xl font-bold mb-10">Select a job</p>
          </div>
          <JobCardList
            jobs={tempJobs}
            onSelectJob={onSelectJob}
            onUnselectJob={onUnselectJob}
            selectedJob={selectedJob}
          />
        </MultiStepFormPage>
        <MultiStepFormPage title="Confirm">
          <h1>Step 2</h1>
        </MultiStepFormPage>
      </MultiStepForm>
      <Link to="/">Back</Link>
    </div>
  );
}
