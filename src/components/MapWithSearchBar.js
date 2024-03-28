import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
import GoogleAutocomplete from 'react-google-autocomplete';


export default function MapWithSearchBar() {
    const libraries = ['places'];
    const apiKey = 'AIzaSyDq0eG4aeLqWijh_E83UgP1N9ae3QcttUM';

    const MapContainer = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [radius, setRadius] = useState(500);

    const onPlaceSelected = (place) => {
        setSelectedLocation(place.geometry.location);
    };

    const mapContainerStyle = {
        height: '500px',
        width: '100%',
    };

    return (
        <div style={{ display: 'flex', height: '500px' }}>
        <GoogleAutocomplete
            placeholder="Search address..."
            onPlaceSelected={onPlaceSelected}
            options={{
            componentRestrictions: { country: 'us' },
            fields: ['geometry'],
            }}
            styles={{
            input: {
                width: '100%',
                height: '42px',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
            },
            container: {
                width: '300px',
                margin: '10px',
            },
            predictions: {
                border: '1px solid #ccc',
                borderRadius: '5px',
            },
            }}
        />
        <LoadScript
            googleMapsApiKey={apiKey}
            libraries={libraries}
        >
            <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={selectedLocation || { lat: 37.7749, lng: -122.4194 }}
            zoom={10}
            >
            {selectedLocation && <Marker position={selectedLocation} />}
            {selectedLocation && (
                <Circle
                center={selectedLocation}
                radius={radius}
                options={{
                    fillColor: 'rgba(0, 128, 128, 0.5)',
                    strokeColor: '#008080',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                }}
                />
            )}
            </GoogleMap>
            <input
            type="range"
            min={100}
            max={5000}
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            style={{ margin: '10px', width: '300px' }}
            />
        </LoadScript>
        </div>
    );
    };


}
