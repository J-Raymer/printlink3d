import Selector from "../components/selector";
import HelpButton from "../components/helpButton";
import TextForm from "../components/textForm";
import { useEffect, useState, useRef } from "react";
import { firebaseDb } from "../firebase/firebase";
import { getMaterials } from "../backend";
import TextArea from "../components/textArea";
import GooglePlacesAutocomplete, { geocodeByPlaceId, getLatLng } from 'react-google-places-autocomplete';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
const libraries = ['places'];


function StyledLine({ title, inputComponent, helpButtonComponent }) {
  return (
    <div>
      <div className="flex py-6">
        <div className="w-40 flex pl-3">
          <div className="mx-2">
            <div className="text-lg font-semibold">{title} </div>
          </div>
          {helpButtonComponent}
        </div>
        {inputComponent}
      </div>
    </div>
  );
}

function MaterialSelector({ init, materials, changeMaterial }) {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedItem, setSelectedItem] = useState(init);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    changeMaterial(item.Type);
  };

  return (
    <div>
      <button onClick={() => setShowOptions(true)}>
        <div className="flex">
          {showOptions ? (
            materials.map((m, idx) => {
              return (
                <div className="pr-3">
                  <div
                    key={idx}
                    onClick={() => handleItemClick(m)}
                    className={`shadow rounded border border-gray-300 text-gray-900 text-sm p-2 cursor-pointer transform transition-transform duration-200
                                    
                                   ${selectedItem.Type === m.Type
                        ? "bg-blue-200"
                        : "bg-gray-50"
                      }`}
                  >
                    <div className="relative group">
                      <div className="w-96 absolute rounded-sm hidden bg-white border border-gray-300 p-2 mt-8 group-hover:block z-10">
                        <p className="text-left text-sm">{m.Description}</p>
                      </div>
                      {m.Type}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex">
              <div className="pr-3">
                <div className="shadow rounded p-2 cursor-pointer bg-blue-200 border border-gray-300 text-gray-900 text-sm">
                  {selectedItem.Type}
                </div>
              </div>
              <div className="pr-3 flex shadow rounded p-2 cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm">
                <div className="cursor-pointer text-sm">
                  More Material Options
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="pt-1 pl-1 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

export default function Configure({ printJob, changePrintJob }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    async function fetchMaterials() {
      setMaterials(await getMaterials(firebaseDb));
    }
    fetchMaterials();
  }, []);

  const changeQuantity = (e) => {
    const newQuantity = e.target.value;
    changePrintJob(newQuantity, "quantity");
  };
  const changeMaterial = (x) => changePrintJob(x, "material");
  const changeColor = (x) => changePrintJob(x, "color");
  const changeCompletionDate = (e) => {
    const newCompletionDate = e.target.value;
    changePrintJob(newCompletionDate, "completionDate");
  };
  const changeComment = (e) => {
    const newComment = e.target.value;
    changePrintJob(newComment, "comment");
  };
  const changeInfill = (x) => changePrintJob(x, "infill");
  const changeLayerHeight = (x) => changePrintJob(x, "layerHeight");
  const changeRadius = (x) => {
    changePrintJob("radius", x);
  }
  const changeLatitude = (x) => changePrintJob("latitude", x);
  const changeLongitude = (x) => changePrintJob("longitude", x);

  // Map-Related Constants
  const [circleKey, setCircleKey] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 48.4284,
    lng: -123.3656,
  });
  const [radius, setRadius] = useState(0);
  const [search_value, setSearchValue] = useState(null);

  const mapRef = useRef(null);
  const [circleRef, setCircleRef] = useState(null);

  const apiKey = 'AIzaSyBN9FNice6SVThI5Yo_MmQS9Or-votMad8';

  const mapContainerStyle = {
    height: '500px',
    width: '100%',
  };

  return (
    <div>
      <div className="p-5">
        <div className="my-4">
          <h2 className="text-3xl font-semibold text-gray-800">
            {" "}
            Print Parameters{" "}
          </h2>
        </div>
        {/* Splitting page into 2 columns */}
        <div className="grid  grid-cols-2 gap-2">
          {/* Column 1 */}
          <div className="bg-white p-4">
            <div className="flex-col">
              <StyledLine
                title="Quantity"
                inputComponent={
                  <TextForm
                    type="number"
                    min="1"
                    value={printJob.quantity}
                    onChange={changeQuantity}
                  />
                }
              />
              <StyledLine
                title="Color"
                inputComponent={
                  <Selector
                    label="color"
                    options={[
                      "No Preference",
                      "Red",
                      "Blue",
                      "Green",
                      "Purple",
                      "Orange",
                      "Yellow",
                      "Brown",
                      "Gray",
                      "Black",
                      "White",
                    ]}
                    initValue={printJob.color}
                    onChange={changeColor}
                  />
                }
              />
              <StyledLine
                title="Material"
                inputComponent={
                  <MaterialSelector
                    init={{ Type: printJob.material }}
                    materials={materials}
                    changeMaterial={changeMaterial}
                  />
                }
                helpButtonComponent={
                  <HelpButton
                    helpText={
                      "The material used in your print. The plastic option allows the printer to decide, but other options are available."
                    }
                  />
                }
              />
              <StyledLine
                title="Comment"
                inputComponent={
                  <TextArea value={printJob.comment} onChange={changeComment} />
                }
                helpButtonComponent={
                  <HelpButton
                    helpText={
                      "Enter any additional print details or specifications you want to communicate to the printer."
                    }
                  />
                }
              />
              <div className="p-5">
                <button onClick={() => setShowAdvanced(!showAdvanced)}>
                  <div className="flex">
                    <div className="pr-3 text-lg font-semibold">Advanced Options</div>
                    {showAdvanced ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    )}
                  </div>
                </button>
                {showAdvanced ? (
                  <div className="p-5">
                    <div className="rounded-lg bg-slate-50">
                      <StyledLine
                        title="Complete By"
                        inputComponent={
                          <TextForm
                            type="date"
                            value={printJob.completionDate}
                            onChange={changeCompletionDate}
                          />
                        }
                        helpButtonComponent={
                          <HelpButton
                            helpText={
                              "The date by which you want your print. You can leave it blank if there is no time constraint."
                            }
                          />
                        }
                      />
                      <StyledLine
                        title="Infill Density"
                        inputComponent={
                          <Selector
                            options={Array.from(
                              { length: 21 },
                              (_, index) => (index * 5).toString() + "%"
                            )}
                            initValue={printJob.infill}
                            onChange={changeInfill}
                          />
                        }
                        helpButtonComponent={
                          <HelpButton
                            helpText={
                              "The density of the internal structure of your print. A higher density is stronger but more expensive."
                            }
                          />
                        }
                      />
                      <StyledLine
                        title="Layer Height"
                        inputComponent={
                          <Selector
                            options={["0.1 mm", "0.2 mm", "0.3 mm"]}
                            initValue={printJob.layerHeight}
                            onChange={changeLayerHeight}
                          />
                        }
                        helpButtonComponent={
                          <HelpButton
                            helpText={
                              "The height of each print layer. Lower values produce a higher resolution print."
                            }
                          />
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </div>

          </div>

          {/* Column 2 */}
          <div className="bg-white p-4">

            {/* Next two columns are nested in an API loader */}
            <LoadScript
              googleMapsApiKey={apiKey}
              libraries={libraries}
            >
              {/* Second Column split */}
              <div className="grid  grid-cols-2 gap-2">

                {/* Column 2.1 */}
                <div className='mt-2 text-lg font-semibold'>
                  <div className="mt-20">
                    <h1>Location</h1>
                    <GooglePlacesAutocomplete //package for the google places API autocomplete search bar
                      selectProps={{
                        search_value,
                        onChange: (value) => { //when the search value changes (by enter or selection of autcomplete results)
                          setSearchValue(value);
                          geocodeByPlaceId(value.value.place_id)
                            .then(results => getLatLng(results[0]))
                            .then(({ lat, lng }) => {
                              setSelectedLocation({ lat, lng });
                              changeLatitude(lat);
                              changeLongitude(lng);
                            });
                        },
                      }}
                    />
                    <br></br>
                    <h1>Radius of travel (km)</h1>
                    <TextForm //draws the radius input box and updates the radius state
                      type="Distance"
                      min="1"
                      value={radius}
                      // set the radius and log that it changed
                      onChange={(e) => {
                        setRadius(Number(e.target.value));
                        setCircleRef(Number(e.target.value));
                        changeRadius(Number(e.target.value));
                        // TODO come up with a better solution for rerendering the circle (instead of using keys)
                        setCircleKey(1); // set the key to force a redraw
                      }}
                    />
                  </div>
                </div>
                {/* Column 2.2 */}
                <div className="mt-2 text-lg font-semibold">
                  <GoogleMap
                    onLoad={map => { (mapRef.current = map) }}
                    mapContainerStyle={mapContainerStyle}
                    center={selectedLocation}
                    zoom={13}
                    options={{
                      disableDefaultUI: true,
                    }}
                  >
                  <Marker position={selectedLocation} key={`marker-${selectedLocation.lat}-${selectedLocation.lng}`} />
                    <Circle
                    center={selectedLocation}
                    radius={radius * 1000}
                    key={circleKey} options={{
                      fillColor: 'rgba(0, 128, 128, 0.5)',
                      strokeColor: '#FFFFFF',
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                    }} />
                  </GoogleMap>
                </div>
              </div>
            </LoadScript>
          </div>
        </div>
      </div>
    </div>
  );
}
