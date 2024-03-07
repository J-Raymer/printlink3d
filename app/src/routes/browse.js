import JobCardList from "../components/jobCardList";
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { firebaseDb } from "../firebase/firebase";
import { collection, doc, onSnapshot, updateDoc, query, where } from "firebase/firestore";
import Selector from "../components/selector";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import boat from "../images/boat.jpg";

export default function Browse() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    "materials": ["PLA", "ABS", "PETG"],
    "colors": ["Red", "Green", "Blue", "Purple", "Orange", "Yellow", "Brown", "Gray", "White", "Black"],
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
          console.log(data)
          fetchedJobs.push({
            doc: doc.id,
            infill: data.Infill,
            material: data.Material,
            distance: data.Radius,
            fileName: data.File,
            name: data.Name,
            email: data.Email,
            color: data.Color,
            layerHeight: data.LayerHeight,
            quantity: data.Quantity,
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
  
  const getDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const onSubmit = () => {
    var updatedHistory = selectedJob.history;
    updatedHistory["Accepted"] = getDate();

    const docRef = doc(firebaseDb, `Jobs/${selectedJob.doc}`);
    updateDoc(docRef, {PrinterUid: userContext.currUser.uid, History: updatedHistory})
    .then(() => {navigate(`/Jobs/${selectedJob.doc}`)});
  };

  return (
    <div>
      {!userContext.userLoggedIn && <Navigate to={"/login"} replace={true} />}

      <MultiStepForm
        submitText="Accept Job"
        showNext={selectedJob !== null}
        validDetails={true}
        handleSubmit={onSubmit}
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
                <h3>Colors:</h3>
                <input type="checkbox" id="color1" name="color1" defaultChecked={isFilterSelected("colors", "Red")} onChange={() => handleCheck("colors", "Red")}/>
                <label htmlFor="color1"> Red</label><br />
                <input type="checkbox" id="color2" name="color2" defaultChecked={isFilterSelected("colors", "Green")} onChange={() => handleCheck("colors", "Green")}/>
                <label htmlFor="color2"> Green</label><br />
                <input type="checkbox" id="color3" name="color3" defaultChecked={isFilterSelected("colors", "Blue")} onChange={() => handleCheck("colors", "Blue")}/>
                <label htmlFor="color3"> Blue</label><br />
                <input type="checkbox" id="color4" name="color4" defaultChecked={isFilterSelected("colors", "Purple")} onChange={() => handleCheck("colors", "Purple")}/>
                <label htmlFor="color4"> Purple</label><br />
                <input type="checkbox" id="color5" name="color5" defaultChecked={isFilterSelected("colors", "Orange")} onChange={() => handleCheck("colors", "Orange")}/>
                <label htmlFor="color5"> Orange</label><br />
                <input type="checkbox" id="color6" name="color6" defaultChecked={isFilterSelected("colors", "Yellow")} onChange={() => handleCheck("colors", "Yellow")}/>
                <label htmlFor="color6"> Yellow</label><br />
                <input type="checkbox" id="color7" name="color7" defaultChecked={isFilterSelected("colors", "Brown")} onChange={() => handleCheck("colors", "Brown")}/>
                <label htmlFor="color7"> Brown</label><br />
                <input type="checkbox" id="color8" name="color8" defaultChecked={isFilterSelected("colors", "Gray")} onChange={() => handleCheck("colors", "Gray")}/>
                <label htmlFor="color8"> Gray</label><br />
                <input type="checkbox" id="color9" name="color9" defaultChecked={isFilterSelected("colors", "Black")} onChange={() => handleCheck("colors", "Black")}/>
                <label htmlFor="color9"> Black</label><br />
                <input type="checkbox" id="color10" name="color10" defaultChecked={isFilterSelected("colors", "White")} onChange={() => handleCheck("colors", "White")}/>
                <label htmlFor="color10"> White</label><br />
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