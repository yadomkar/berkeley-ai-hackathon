import GoogleMapReact from 'google-map-react';
import React, { useState } from "react";
import upload from "../assets/upload.svg";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import axios from 'axios';
import trashcanIcon from '../assets/trashcan.svg'
import { useLogoutFunction, useRedirectFunctions, withAuthInfo } from '@propelauth/react';

const Map = withAuthInfo((props) =>{
  const config = {
    headers: {
      'Authorization': 'Bearer ' + props.accessToken
    }
  };

  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [stops, setStops] = useState([]);
   const [error, setError] = useState(null);
   const markers = [{latitude: 37.871960, longitude: -122.259094}, {latitude: 37.7749, longitude: -122.4194}]

    useEffect(() => {
      if (!navigator.geolocation) {
          setError('User location inaccessible');
          return;
      }

      navigator.geolocation.getCurrentPosition(success);
      axios.get(`http://localhost:8000/locations/`, config)
      .then(response => {
        console.log("response from server", response.data);
        setStops(response.data);
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
  }, []);

  const success = (position) => {
   const latitude = position.coords.latitude;
   const longitude = position.coords.longitude;
   setLocation({ latitude, longitude });
};


  const defaultProps = {
   center: {
      lat: location.latitude,
      lng: location.longitude
   },
   zoom: 15
 };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%' }}>
      {location ? (
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_KEY }}
          center={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          { location &&
               markers.map((stop, index) => (
                  <img src={trashcanIcon}
                     lat={stop.latitude}
                     lng={stop.longitude}
                     width={40}
                     height={40}
                  />

               ))
            }
        </GoogleMapReact>
      ) : (
        <div>Loading map...</div>
      )}
    </div>
  );
});

export default Map;
