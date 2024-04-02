import JobCardList from "../components/jobCardList";
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { firebaseDb } from "../firebase/firebase";
import { collection, onSnapshot, query, where, arrayUnion } from "firebase/firestore";
import Selector from "../components/selector";
import MultiStepForm from "../components/multistepform";
import MultiStepFormPage from "../components/multistepformpage";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { getThumbnail, getColors, getMaterials, updateJob, addBid } from "../backend";
import GooglePlacesAutocomplete, { geocodeByPlaceId, getLatLng} from 'react-google-places-autocomplete';
import TextForm from "../components/textForm";
import { LoadScript } from '@react-google-maps/api';
import { BidSubmission } from "../components/bids";
import { RatingStatsCard } from "../components/ratingStatsCard";
const libraries = ['places'];



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
  const [bidIsValid, setBidIsValid] = useState(null);
  const userContext = useAuth();
  const uid = userContext.currUser.uid;
  const navigate = useNavigate();
  
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
    const jobQuery = query(jobRef, where("PrinterUid", "==", null), 
                                  where("UploadedFile", "==", true));
    
    const unsubscribe = onSnapshot(jobQuery, async (snapshot) => {
      try {
        const fetchedJobs = [];
  
        await Promise.all(snapshot.docs.map(async (doc) => {
          const data = doc.data();

          if ((data.BidderUid !== undefined) && (! data.BidderUid.includes(uid))) {
            let thumbnail = null;

            try {
              thumbnail = await getThumbnail(doc.id);
            } catch (error) {
              console.error("Error fetching thumbnail: ", error)
              thumbnail = null;
            }
  
            fetchedJobs.push({
              jobName: data.JobName,
              thumbnail: thumbnail,
              doc: doc.id,
              infill: data.Infill,
              material: data.Material,
              distance: data.Radius,
              file: data.File,
              name: data.Name,
              email: data.Email,
              color: data.Color,
              layerHeight: data.LayerHeight,
              quantity: data.Quantity,
              comment: data.Comment,
              completionDate: data.CompletionDate,
              bidHistory: data.BidHistory,
              history: data.History,
              cuid: data.CustomerUid,
            });
          } else {
            console.log("Not parsing: ", doc);
          }     
        }));
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })

    return () => {
      unsubscribe();
    };
  }, [uid]);

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

  const onBidSubmit = async (bidDetails) => {
    const jobId = selectedJob.doc;
    const uid = userContext.currUser.uid;

    await addBid(jobId, bidDetails);
    updateJob(jobId, { BidderUid: arrayUnion(uid) })
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

  const onBidChanged = (e) => {
    if (e.target.value == "") {
      setBidIsValid(false);
      return
    }
    if (!isNaN(+e.target.value)) {
      if (Number(+e.target.value) < 0) {
        setBidIsValid(false);
        return;
      }
      setBidIsValid(true);
    }
  }

  // Map-Related Constants
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 48.4284,
    lng: -123.3656,
  });
  const [radius, setRadius] = useState(0);
  const [search_value, setSearchValue] = useState(null);
  const apiKey = 'AIzaSyBeu0giaCGz9vMeTn1HBRtTRlWQuVZwpZs';


  return (
    <div>
      {!userContext.userLoggedIn && <Navigate to={"/login"} replace={true} />}

      <MultiStepForm
        showSubmit={false}
        showNext={selectedJob !== null}
        validDetails={true}
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
              <div className="mt-3">
                <h1>Location:</h1> 
                <LoadScript
                  googleMapsApiKey={apiKey}
                  libraries={libraries}
                >
                  <GooglePlacesAutocomplete //package for the google places API autocomplete search bar
                      selectProps={{
                          search_value,        
                          onChange: (value) => { //when the search value changes (by enter or selection of autcomplete results)
                              setSearchValue(value);
                              geocodeByPlaceId(value.value.place_id)
                                  .then(results => getLatLng(results[0]))
                                  .then(({ lat, lng }) => {
                                  setSelectedLocation({ lat, lng });
                                  });
                          },
                      }}
                  />
                </LoadScript>
                <div className="mt-3">
                  <h1>Radius of travel: (km)</h1>
                  <TextForm //draws the radius input box and updates the radius state
                      type="Distance"
                      min="1"
                      value={radius}
                      // set the radius and log that it changed
                      onChange={(e) => {
                          setRadius(Number(e.target.value));
                      }}
                  />
                </div>
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
            <div className="flex flex-col h-full gap-5">
              <div className="flex flex-row gap-5 h-[50%]">
                <img
                  className="object-cover rounded"
                  src={selectedJob.thumbnail}
                  alt={selectedJob.fileName}
                />
                <div className="p-6 flex-grow rounded border border-gray-300">
                  <h2 className="text-3xl font-bold">Job Parameters</h2>
                  <p className="text-gray-400 text-l font-bold">Please ensure your printer can handle the job specifications listed below</p>

                  <table className="browse-table text-l mt-3">
                    <tr>
                      <td className="w-[160px]">File Name: </td>
                      <td>{selectedJob.fileName}</td>
                    </tr>
                    <tr>
                      <td>Infill:</td>
                      <td>{selectedJob.infill}</td>
                    </tr>
                    <tr>
                      <td>Material:</td>
                      <td>{selectedJob.material}</td>
                    </tr>
                    <tr>
                      <td>Colour:</td>
                      <td>{selectedJob.color}</td>
                    </tr>
                    <tr>
                      <td>Layer Height:</td>
                      <td>{selectedJob.layerHeight}</td>
                    </tr>
                    <tr>
                      <td>Quantity:</td>
                      <td>{selectedJob.quantity}</td>
                    </tr>
                    <tr>
                      <td>Completion Date:</td>
                      <td>{selectedJob.completionDate !== "" ? selectedJob.completionDate : "None"}</td>
                    </tr>
                    <tr>
                      <td>Comment:</td>
                      <td>{selectedJob.comment !== "" ? selectedJob.comment : "None"}</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div className="flex flex-row gap-5 h-[50%] w-full">
                <div className="w-[50%] rounded border border-gray-300 p-6">
                  <h2 className="text-3xl font-bold">Customer Reviews</h2>
                  <RatingStatsCard userId={selectedJob.cuid}/>
                </div>
                <div className="w-[50%] rounded border border-gray-300 p-6">
                  <BidSubmission jobId={selectedJob.doc} callback={onBidSubmit}/>
                </div>
              </div>
            </div>
          )}
        </MultiStepFormPage>

      </MultiStepForm>
    </div>
  );
}