import React, { useState, useEffect, FunctionComponent } from "react";
import {APIProvider, Marker, AdvancedMarker, Map} from '@vis.gl/react-google-maps';
import GooglePlacesAutocomplete, { geocodeByPlaceId, getLatLng} from 'react-google-places-autocomplete';
import TextForm from "./textForm";

export default function MapSearch() {
    const [map, setMap] = useState({
        lat: 48.4284,
        lng: -123.3656,
    });
    const [radius, setRadius] = useState(10);
    const [search_value, setSearchValue] = useState(null);

    return (
        <div className="mb-2 mt-5 max-w-40">
            <h1>Select your location</h1>
            <GooglePlacesAutocomplete //package for the google places API autocomplete search bar
            apiKey="GOOGLE_API_KEY_HERE"
            selectProps={{
                search_value,        
                onChange: (value) => { //when the search value changes (by enter or selection of autcomplete results)
                console.log(value);
                setSearchValue(value); //set the search value to the selected value
                geocodeByPlaceId(value.value.place_id) //get the google geocode value via the place_id
                    .then(results => getLatLng(results[0])) //get the lat and lng from the google geocode
                    .then(({ lat, lng }) => {
                    setMap({lat, lng}); //set the map state to the lat and lng to update the marker and circle
                    console.log(lat, lng);
                    });
                },
            }}
            />
            <div className="aspect-square max-w-40">
                <APIProvider apiKey={"GOOGLE_API_KEY_HERE"}>
                <Map mapId={'filter-map'}
                    center={map} //set the center of the map to the lat and lng state, moves the map with map state change
                    defaultZoom={13} 
                    gestureHandling={'greedy'} 
                    disableDefaultUI={false} //includes all of the extra UI stuff, set to true to get rid of a lot of it (more noticeable when the map is large)
                    
                    //Ignore the following for now, was trying to debug the callbacks
                    //and the circle drawing function, as it's not currently working
                    onDrag={(map) => console.log(map, "dragged")}
                    onGoogleApiLoaded={({map_load, maps}) =>
                        console.log(map_load, maps, "loaded")
                        // new maps.Circle({
                        //   strokeColor: '#FF0000',
                        //   strokeOpacity: 0.8,
                        //   strokeWeight: 2,
                        //   fillColor: '#FF5066',
                        //   fillOpacity: 0.5,
                        //   map_load,  
                        //   center: map,
                        //   radius: 1000,})
                        //^is commented out because the callback functions
                        //are not being called
                        }
                >
                    
                    
                    <Marker position={map} //draws the marker and updates it with map state
                            onChange={(map) => {console.log(map, "changed");}
                                //this onChange callback also does not work
                                //I'm likely misunderstanding the event, tried to use
                                //it to draw the circle on the map but the circle requires the map event.
                                //will look back into it soon
                    }/> 

                </Map>
                </APIProvider>
            </div>
            <div className='mt-2 max-w-40'>
                <h1>Radius of travel (km)</h1>
                <TextForm //draws the radius input box and updates the radius state
                    type="Distance"
                    min="1"
                    value={radius}
                    // set the radius and log that it changed
                    onChange={(e) => {
                        setRadius(e.target.value);
                        console.log(e.target.value);
                    }}
                />
            </div>
        </div>

    )


}