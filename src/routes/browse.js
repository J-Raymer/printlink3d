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
import { getThumbnail, getColors, getMaterials } from "../backend";

export default function Browse() {
  const [availableColors, setAvailableColors] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    "materials": availableMaterials,
    "colors": availableColors,
    "bid_order": 0,
  });
  
  useEffect(() => {
    async function fetchColors() {
      const colors = await getColors(firebaseDb);
      setAvailableColors(colors);
      setFilters(filters => ({ ...filters, colors: colors }));
    }
    fetchColors();
  }, []);

  useEffect(() => {
    async function fetchMaterials() {
      setAvailableMaterials(await getMaterials(firebaseDb));
    }
    fetchMaterials();
  }, []);

  useEffect(() => {
    const jobRef = collection(firebaseDb, 'Jobs');
    const jobQuery = query(jobRef, where("PrinterUid", "==", null), where("UploadedFile", "==", true));
    
    const unsubscribe = onSnapshot(jobQuery, async (snapshot) => {
      try {
        const fetchedJobs = [];
  
        await Promise.all(snapshot.docs.map(async (doc) => {
          const data = doc.data();
          let thumbnail = null;
          
          try {
            thumbnail = await getThumbnail(doc.id);
          } catch (error) {
            console.error("Error fetching thumbnail: ", error)
            thumbnail = null;
          }

          fetchedJobs.push({
            thumbnail: thumbnail,
            doc: doc.id,
            infill: data.Infill,
            material: data.Material,
            distance: data.Radius,
            fileName: data.FileName,
            file: data.File,
            name: data.Name,
            email: data.Email,
            color: data.Color,
            layerHeight: data.LayerHeight,
            quantity: data.Quantity,
            comment: data.Comment,
            completionDate: data.CompletionDate,
            history: data.History,
          });
        }));
        
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })

    return () => {
      unsubscribe();
    };
  }, []);

  const userContext = useAuth();
  const navigate = useNavigate();

  const onSelectJob = (job) => {
    setSelectedJob(job);
  };

  const onUnselectJob = () => {
    setSelectedJob(null);
  };

  const handleCheck = (category, label) => {
    let t = [...filters[category]];
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
    updateDoc(docRef, { PrinterUid: userContext.currUser.uid, History: updatedHistory })
      .then(() => { navigate(`/Jobs/${selectedJob.doc}`) });
  };

  const renderColorSelector = () => {
    return (
      <div>
        {availableColors.map((color, index) => (
          <React.Fragment key={color}>
            <input
              type="checkbox"
              id={`color${index}`}
              name={`color${index}`}
              defaultChecked={isFilterSelected("colors", color)}
              onChange={() => handleCheck("colors", color)}
            />
            <label htmlFor={`color${index}`}> {color}</label><br />
          </React.Fragment>
        ))}
      </div>
    );
  }

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
                {renderColorSelector()}
              </div>
              <div className="mt-3">
                <h3>Sort Bid:</h3>
                <Selector label="Bid" options={["Lowest to highest", "Highest to lowest"]} padding={1} />
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
                src={(selectedJob.thumbnail)? selectedJob.thumbnail: boat}
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
                <br />
                <p><strong>Completion Date:</strong> {selectedJob.completionDate !== "" ? selectedJob.completionDate : "None"}</p>
                <br />
                <p><strong>Comment:</strong> {selectedJob.comment !== "" ? selectedJob.comment : "None"}</p>
              </div>
            </div>
          )}
        </MultiStepFormPage>

      </MultiStepForm>
    </div>
  );
}