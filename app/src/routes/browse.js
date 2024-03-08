import JobCardList from "../components/jobCardList";
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { firebaseDb } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Selector from "../components/selector";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import { useAuth } from "../contexts/authContext/index";
import boat from "../images/boat.jpg";

export default function Browse() {
  const { userLoggedIn } = useAuth();

  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    "materials": ["PLA", "ABS", "PETG"],
    "colours": ["Red", "Green", "Blue", "Purple", "Orange", "Yellow", "Brown", "Gray", "White", "Black"],
    "bid_order": 0,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firebaseDb, "Jobs"),
      (snapshot) => {
        const fetchedJobs = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          console.log(data)
          fetchedJobs.push({
            infill: data.Infill,
            material: data.Material,
            distance: data.Radius,
            fileName: data.File,
            name: data.Name,
            email: data.Email,
            color: data.Color,
            layerHeight: data.LayerHeight,
            quantity: data.Quantity,
            history: data.History,
          });
          console.log(fetchedJobs)
        });
        setJobs(fetchedJobs);
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
    setFilters({ ...filters, [category]: t });
  }

  const isFilterSelected = (category, label) => {
    return filters[category].includes(label);
  }

  const changeMaterial = (x) => { };
  const changeColor = (x) => { };
  const changeBid = (x) => { };

  return (
    <div>
      {!userLoggedIn && <Navigate to={"/login"} replace={true} />}

      <MultiStepForm
        submitText="Accept Job"
        showNext={selectedJob !== null}
        validDetails={true}
        handleSubmit={() => { }}
      >
        <MultiStepFormPage title="Select Job">
          <div className="flex h-full">
            <div className="md:flex flex-col w-[250px] border border-gray-300 rounded p-3">
              <h2 className="text-2xl font-bold">Job Filters</h2>
              <div className="mt-3">
                <h3>Material Type:</h3>
                <input type="checkbox" id="material1" name="material1" value="PLA" defaultChecked={isFilterSelected("materials", "PLA")} onChange={() => handleCheck("materials", "PLA")} />
                <label htmlFor="material1"> PLA</label><br />
                <input type="checkbox" id="material2" name="material2" value="ABS" defaultChecked={isFilterSelected("materials", "ABS")} onChange={() => handleCheck("materials", "ABS")} />
                <label htmlFor="material2"> ABS</label><br />
                <input type="checkbox" id="material3" name="material3" value="PETG" defaultChecked={isFilterSelected("materials", "PETG")} onChange={() => handleCheck("materials", "PETG")} />
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
          {selectedJob && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                className="h-96 w-full object-cover md:w-96"
                src={boat}
                alt={selectedJob.fileName}
              />
              <div className="ml-5">
                <p><strong>File Name:</strong> {selectedJob.fileName}</p>
                <br />
                <p><strong>Infill:</strong> {selectedJob.infill}</p>
                <br />
                <p><strong>Material:</strong> {selectedJob.material}</p>
                <br />
                <p><strong>Color:</strong> {selectedJob.color}</p>
                <br />
                <p><strong>Layer Height:</strong> {selectedJob.layerHeight}</p>
                <br />
                <p><strong>Quantity:</strong> {selectedJob.quantity}</p>
              </div>
            </div>
          )}
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