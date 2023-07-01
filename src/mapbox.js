import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxGeocoder from "mapbox-gl-geocoder";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN;

const MapboxMap = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [0, 0],
      zoom: 1,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });

    map.addControl(geocoder);

    // Clean up on component unmount
    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} style={{ height: "400px" }} />;
};

export default MapboxMap;
