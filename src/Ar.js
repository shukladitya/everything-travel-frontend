import { useState } from "react";

const LocationAr = () => {
  const [locationFetched, setLocationFetched] = useState(false);
  window.onload = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      // document
      //   .querySelector("a-text")
      //   .setAttribute(
      //     "gps-entity-place",
      //     `latitude: ${position.coords.latitude}; longitude: ${position.coords.longitude};`
      //   );
      setLocationFetched(position);
    });
  };

  return (
    <>
      {locationFetched && (
        <a-scene
          vr-mode-ui="enabled: false"
          embedded
          arjs="sourceType: webcam; debugUIEnabled: false;"
        >
          <a-text
            value="No markers around"
            look-at="[gps-camera]"
            gps-entity-place={`latitude:${locationFetched.coords?.latitude}; longitude: ${locationFetched.coords?.longitude};`}
            scale="5 5 5"
          ></a-text>
          <a-camera gps-camera rotation-reader></a-camera>
        </a-scene>
      )}
    </>
  );
};
export default LocationAr;
