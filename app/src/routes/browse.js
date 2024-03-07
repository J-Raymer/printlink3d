import JobCardList from "../components/jobCardList";
import React, { useState, useEffect } from "react";
import { firebaseDb } from "../firebase/firebase";
import { collection, doc, onSnapshot, updateDoc, query, where } from "firebase/firestore";
import Selector from "../components/selector";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";

export default function Browse() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    "materials": ["PLA", "ABS", "PETG"],
    "colours": ["Red", "Green", "Blue", "Purple", "Orange", "Yellow", "Brown", "Gray", "White", "Black"],
    "bid_order": 0,
  });
  const userContext = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const jobRef = collection(firebaseDb, 'Jobs');
    const availableJobQuery = query(jobRef, where("PrinterUid", "==", null));

    const unsubscribe = onSnapshot(availableJobQuery, (snapshot) => {
        const fetchedJobs = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          console.log(data);
          fetchedJobs.push({
            doc: doc.id,
            infill: data.Fill_Percentage,
            material: data.Material,
            distance: data.Radius,
            fileName: data.File,
            quantity: data.Quantity,
            history: data.History,
            colour: data.Color
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

  const handleCheck = (category, label) => {
    let t = filters[category];
    if (t.includes(label)) {
      t.splice(t.indexOf(label), 1);
    } else {
      t.push(label);
    }
    setFilters({...filters, [category]: t});
  }

  const isFilterSelected = (category, label) => {
    return filters[category].includes(label);
  }

  const changeMaterial = (x) => { };
  const changeColor = (x) => { };
  const changeBid = (x) => { };
  
  const getDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const onSubmit = () => {
    var updatedHistory = selectedJob.history
    updatedHistory["Accepted"] = getDate();

    const docRef = doc(firebaseDb, `Jobs/${selectedJob.doc}`);
    updateDoc(docRef, {PrinterUid: userContext.currUser.uid, History: updatedHistory})
    .then(() => {navigate(`/Jobs/${selectedJob.doc}`)});
  };

  return (
    <div>
      <MultiStepForm
        submitText="Accept Job"
        showNext={true}
        validDetails={true}
        handleSubmit={onSubmit}
      >
      <MultiStepFormPage title="Select Job">
        <div className="flex h-full">
          <div className="md:flex flex-col w-[250px] border border-gray-300 rounded p-3">
            <h2 className="text-2xl font-bold">Job Filters</h2>
            <div className="mt-3">
              <h3>Material Type:</h3>
              <input type="checkbox" id="material1" name="material1" value="PLA" defaultChecked={isFilterSelected("materials", "PLA")} onChange={() => handleCheck("materials", "PLA")}/>
              <label htmlFor="material1"> PLA</label><br />
              <input type="checkbox" id="material2" name="material2" value="ABS" defaultChecked={isFilterSelected("materials", "ABS")} onChange={() => handleCheck("materials", "ABS")}/>
              <label htmlFor="material2"> ABS</label><br />
              <input type="checkbox" id="material3" name="material3" value="PETG" defaultChecked={isFilterSelected("materials", "PETG")} onChange={() => handleCheck("materials", "PETG")}/>
              <label htmlFor="material3"> PETG</label><br />
            </div>
            <div className="mt-3">
              <h3>Colours:</h3>
              <input type="checkbox" id="colour1" name="colour1" defaultChecked={isFilterSelected("colours", "Red")} onChange={() => handleCheck("colours", "Red")}/>
              <label htmlFor="colour1"> Red</label><br />
              <input type="checkbox" id="colour2" name="colour2" defaultChecked={isFilterSelected("colours", "Green")} onChange={() => handleCheck("colours", "Green")}/>
              <label htmlFor="colour2"> Green</label><br />
              <input type="checkbox" id="colour3" name="colour3" defaultChecked={isFilterSelected("colours", "Blue")} onChange={() => handleCheck("colours", "Blue")}/>
              <label htmlFor="colour3"> Blue</label><br />
              <input type="checkbox" id="colour4" name="colour4" defaultChecked={isFilterSelected("colours", "Purple")} onChange={() => handleCheck("colours", "Purple")}/>
              <label htmlFor="colour4"> Purple</label><br />
              <input type="checkbox" id="colour5" name="colour5" defaultChecked={isFilterSelected("colours", "Orange")} onChange={() => handleCheck("colours", "Orange")}/>
              <label htmlFor="colour5"> Orange</label><br />
              <input type="checkbox" id="colour6" name="colour6" defaultChecked={isFilterSelected("colours", "Yellow")} onChange={() => handleCheck("colours", "Yellow")}/>
              <label htmlFor="colour6"> Yellow</label><br />
              <input type="checkbox" id="colour7" name="colour7" defaultChecked={isFilterSelected("colours", "Brown")} onChange={() => handleCheck("colours", "Brown")}/>
              <label htmlFor="colour7"> Brown</label><br />
              <input type="checkbox" id="colour8" name="colour8" defaultChecked={isFilterSelected("colours", "Gray")} onChange={() => handleCheck("colours", "Gray")}/>
              <label htmlFor="colour8"> Gray</label><br />
              <input type="checkbox" id="colour9" name="colour9" defaultChecked={isFilterSelected("colours", "Black")} onChange={() => handleCheck("colours", "Black")}/>
              <label htmlFor="colour9"> Black</label><br />
              <input type="checkbox" id="colour10" name="colour10" defaultChecked={isFilterSelected("colours", "White")} onChange={() => handleCheck("colours", "White")}/>
              <label htmlFor="colour10"> White</label><br />
            </div>
            <div className="mt-3">
              <h3>Sort Bid:</h3>
              <Selector label="Bid" options={["Lowest to highest", "Highest to lowest"]} padding={1} onChange={changeBid} />
            </div>
          </div>
          <div className="grow p-3 pt-0 overflow-y-scroll">
            <JobCardList
              jobs={jobs}
              filters={filters}
              onSelectJob={onSelectJob}
              onUnselectJob={onUnselectJob}
              selectedJob={selectedJob}
            />
          </div>
        </div>

      </MultiStepFormPage>
      <MultiStepFormPage title="Confirm">

      </MultiStepFormPage>

      </MultiStepForm>
    </div>
  );
}


/*
<FontAwesomeIcon icon="fa-solid fa-user" />

 <div>
      <div className="flex justify-center">
        <p className="text-4xl font-bold mb-10 mt-10">Select a Job</p>
      </div>
      <div className="flex">
        <div className="w-1/4 border-2 ml-10 mr-10 border-black overflow-auto">
          <div className="m-5">
            <p className="font-bold">Material:</p>
            <div className="ml-10">
              <input
                type="checkbox"
                id="material1"
                name="material1"
                value="PLA"
              />
              <label htmlFor="material1"> PLA</label>
              <br />
              <input
                type="checkbox"
                id="material2"
                name="material2"
                value="ABS"
              />
              <label htmlFor="material2"> ABS</label>
              <br />
              <input
                type="checkbox"
                id="material3"
                name="material3"
                value="PETG"
              />
              <label htmlFor="material3"> PETG</label>
              <br />
            </div>
            <p className="font-bold">Color:</p>
            <div className="ml-10">
              <input type="checkbox" id="red" name="red" value="Red" />
              <label htmlFor="red"> Red</label>
              <br />
              <input type="checkbox" id="green" name="green" value="Green" />
              <label htmlFor="green"> Green</label>
              <br />
              <input type="checkbox" id="blue" name="blue" value="Blue" />
              <label htmlFor="blue"> Blue</label>
              <br />
            </div>
            <div className="flex mt-2">
              <p className="font-bold mr-3">Bid:</p>
              <div>
                <Selector
                  label="Bid"
                  options={["Lowest to highest", "Highest to lowest"]}
                  padding={1}
                  onChange={changeBid}
                />
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
*/