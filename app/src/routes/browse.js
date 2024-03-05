import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import JobCardList from "../components/jobCardList";
import React, { useState, useEffect } from "react";
import { GetAllJobs } from "../backend";
import { firebaseDb } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Browse() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firebaseDb, "Jobs"),
      (snapshot) => {
        const fetchedJobs = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          fetchedJobs.push({
            infill: data.Fill_Percentage,
            material: data.Material,
            distance: data.Radius,
            fileName: data.STL,
            name: data.Name,
            email: data.Email,
          });

          setJobs(fetchedJobs);
        });
      }
    );

    return () => {
      unsubscribe(); // Cleanup function to unsubscribe from real-time updates when the component unmounts
    };
  }, []);

  const onSelectJob = (job) => {
    setSelectedJob(job);
  };

  const onUnselectJob = () => {
    setSelectedJob(null);
  };

  return (
    <div>
      <h1 className="text-4xl font-extrabold p-6 pl-4">Browse</h1>
      <MultiStepForm
        submitText="Accept Job"
        showNext={selectedJob !== null}
        validDetails={true}
      >
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
        <MultiStepFormPage title="Job Details">
          <div className="flex justify-center">
            <p className="text-4xl font-bold">Job Details</p>
          </div>
          <div className="text-3xl leading-loose">
            <p>Name: {selectedJob !== null && selectedJob.name}</p>
            <p>Email: {selectedJob !== null && selectedJob.email}</p>
          </div>
        </MultiStepFormPage>
      </MultiStepForm>
    </div>
  );
}
