import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import JobCardList from "../components/jobCardList";
import React, { useState, useEffect } from 'react';
import { GetAllJobs } from "../backend";
import { firebaseDb } from '../firebase';
import { collection, onSnapshot } from "firebase/firestore";
import Selector from "../components/selector";

export default function Browse() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firebaseDb, 'Jobs'), (snapshot) => {
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
    })

    return () => {
      unsubscribe(); // Cleanup function to unsubscribe from real-time updates when the component unmounts
    };
  }, []);

  const onSelectJob = (job) => {
    setSelectedJob(job);
  }

  const onUnselectJob = () => {
    setSelectedJob(null);
  }

  const changeMaterial = (x) => { };
  const changeColor = (x) => { };
  const changeBid = (x) => { };

  return (
    <div>
      <div className="flex justify-center">
        <p className="text-4xl font-bold mb-10 mt-10">Select a Job</p>
      </div>
      <div className="flex">
        <div className="w-1/4 border-2 ml-10 mr-10 border-black overflow-auto">
          <div className="ml-5">
            <p className="font-bold">Material:</p>
            <div className="ml-10">
              <input type="checkbox" id="material1" name="material1" value="PLA" />
              <label htmlFor="material1">PLA</label><br />
              <input type="checkbox" id="material2" name="material2" value="ABS" />
              <label htmlFor="material2">ABS</label><br />
              <input type="checkbox" id="material3" name="material3" value="PETG" />
              <label htmlFor="material3">PETG</label><br />
            </div>
            <p className="font-bold">Color:</p>
            <div className="ml-10">
              <input type="checkbox" id="red" name="red" value="Red" />
              <label htmlFor="red">Red</label><br />
              <input type="checkbox" id="green" name="green" value="Green" />
              <label htmlFor="green">Green</label><br />
              <input type="checkbox" id="blue" name="blue" value="Blue" />
              <label htmlFor="blue">Blue</label><br />
            </div>
            <div className="flex mt-2">
              <p className="font-bold mr-3">Bid:</p>
              <div>
                <Selector label="Bid" options={["Lowest", "Highest"]} padding={1} onChange={changeBid} />
              </div>
            </div>
          </div>
        </div>
        <div className="w-3/4">
          <JobCardList
            jobs={jobs}
            onSelectJob={onSelectJob}
            onUnselectJob={onUnselectJob}
            selectedJob={selectedJob}
          />
        </div>
      </div>
    </div>
  );
}
