import React, { useState, useRef, useEffect, FunctionComponent } from "react";
import GooglePlacesAutocomplete, { geocodeByPlaceId, getLatLng} from 'react-google-places-autocomplete';
import TextForm from "./textForm";
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';


// This Component is for reference for implementation on other routes, as it contains all of the possibly
// useful code for the map search bar. It is not currently used in the project.

const libraries = ['places'];

export default function MapSearch2() {
    const [selectedLocation, setSelectedLocation] = useState({
        lat: 48.4284,
        lng: -123.3656,
    });
    const [radius, setRadius] = useState(1000);
    const [search_value, setSearchValue] = useState(null);

    const mapRef = useRef(null);
    const [circleRef, setCircleRef] = useState(null);
    
    // useEffect(() => {
    //     console.log(mapRef.current);
    //     if(mapRef.current){
    //         if (circleRef) {
    //         mapRef.current.remove(circleRef);
    //         }
        
    //         if (selectedLocation) {
    //         const newCircle = new window.google.maps.Circle({
    //             center: selectedLocation,
    //             radius: radius*1000,
    //             options: {
    //             fillColor: 'rgba(0, 128, 128, 0.5)',
    //             strokeColor: '#008080',
    //             strokeOpacity: 0.8,
    //             strokeWeight: 2,
    //             },
    //         });
        
    //         setCircleRef(newCircle);
        
    //         mapRef.current.add(newCircle);
    //         }
    //     }
    //   }, [selectedLocation, radius, mapRef]);

    const apiKey = 'AIzaSyCe8pXdsTx4MXjIr0JSF10N08Y3oMxoFk8';

    const mapContainerStyle = {
        height: '500px',
        width: '100%',
    };

    return (
        <div className="text-lg font-semibold">
            <h1>Select your location</h1>
            <div className="aspect-square max-w-40">
                <LoadScript
                    googleMapsApiKey={apiKey}
                    libraries={libraries}
                >
                    <GooglePlacesAutocomplete //package for the google places API autocomplete search bar
                        selectProps={{
                            search_value,        
                            onChange: (value) => { //when the search value changes (by enter or selection of autcomplete results)
                                console.log(value);
                                setSearchValue(value);
                                geocodeByPlaceId(value.value.place_id)
                                    .then(results => getLatLng(results[0]))
                                    .then(({ lat, lng }) => {
                                    setSelectedLocation({ lat, lng });
                                    console.log(lat, lng);
                                    });
                            },
                        }}
                    />

                    <GoogleMap
                        onLoad = {map => {(mapRef.current = map); console.log(mapRef.current)}}
                        mapContainerStyle={mapContainerStyle}
                        center={selectedLocation} 
                        zoom={13}
                        // onLoad={map => {(mapRef.current = map); console.log(mapRef.current)}}
                        options={{
                            disableDefaultUI: true,
                          }}
                        >
                        <Marker position={selectedLocation} key={`marker-${selectedLocation.lat}-${selectedLocation.lng}`}/>


                        {circleRef && <Circle center={selectedLocation} radius={radius*1000} key={`marker-`} options={{
                                fillColor: 'rgba(0, 128, 128, 0.5)',
                                strokeColor: '#FFFFFF',
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                            }} />}
                        {/* <Circle
                            center={selectedLocation}
                            radius={radius}
                            key={`marker-`}
                            options={{
                                fillColor: 'rgba(0, 128, 128, 0.5)',
                                strokeColor: '#FFFFFF',
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                            }}
                        /> */}
                        
                    </GoogleMap>
                    <input
                    type="range"
                    min={1}
                    max={50}
                    value={radius}
                    onChange={(e) => {setRadius(Number(e.target.value));
                                      setCircleRef(Number(e.target.value));
                                      console.log(e.target.value);
                                      }}
                    style={{ margin: '10px', width: '300px' }}
                    />
                </LoadScript>
            </div>
            <div className='mt-2 max-w-40'>
                <h1>Radius of travel (m)</h1>
                <TextForm //draws the radius input box and updates the radius state
                    type="Distance"
                    min="1"
                    value={radius}
                    // set the radius and log that it changed
                    onChange={(e) => {
                        setRadius(Number(e.target.value));
                        setCircleRef(Number(e.target.value));
                        console.log(typeof(e.target.value));
                    }}
                />
            </div>
        </div>

    )


}