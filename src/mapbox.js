import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import MapboxGeocoder from "mapbox-gl-geocoder";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN;

const MapboxMap = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [795.956, 21.9162],
      zoom: 4.5,
      minZoom: 2.3,
      projection: "globe",
    });

    //search funcationality
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });

    map.addControl(geocoder);

    //fullscreen
    map.addControl(
      new mapboxgl.FullscreenControl({
        container: document.querySelector("body"),
      })
    );

    //geolocation and finding user below
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });
    map.addControl(geolocate);
    map.on("load", () => {
      geolocate.trigger();
    });

    // add image on users location

    // geolocate.on("geolocate", (e) => {
    //   map.loadImage(
    //     "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png",
    //     (error, image) => {
    //       console.log(e);
    //       if (error) throw error;
    //       map.addImage("cat", image);
    //       map.addLayer({
    //         id: "points",
    //         type: "symbol",
    //         source: {
    //           type: "geojson",
    //           data: {
    //             type: "FeatureCollection",
    //             features: [
    //               {
    //                 type: "Feature",
    //                 geometry: {
    //                   type: "Point",
    //                   coordinates: [e.coords.longitude, e.coords.latitude],
    //                 },
    //               },
    //             ],
    //           },
    //         },
    //         layout: {
    //           "icon-image": "cat",
    //           "icon-size": 0.3,
    //         },
    //       });
    //     }
    //   );
    // });

    // marker placing logic

    const userMarkers = [];

    map.on("click", (e) => {
      console.log([e.lngLat.lat, e.lngLat.lng]);
      userMarkers.push(
        new mapboxgl.Marker({
          color: "#8458B3",
          draggable: true,
        })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map)
      );
    });

    //directions and routes
    map.addControl(
      new MapboxDirections({
        accessToken: mapboxgl.accessToken,
      }),
      "top-left"
    );

    //setting fog and stars on map
    map.on("load", () => {
      map.setFog({
        range: [-1, 2],
        "horizon-blend": 0.3,
        color: "#242B4B",
        "high-color": "#161B36",
        "space-color": "#0B1026",
        "star-intensity": 1,
      });
    });

    //
    //
    //globe rotation

    // At low zooms, complete a revolution every two minutes.
    const secondsPerRevolution = 120;
    // Above zoom level 5, do not rotate.
    const maxSpinZoom = 5;
    // Rotate at intermediate speeds between zoom levels 3 and 5.
    const slowSpinZoom = 3;

    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
      const zoom = map.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          // Slow spinning at higher zooms
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.getCenter();
        center.lng -= distancePerSecond;
        // Smoothly animate the map over one second.
        // When this animation is complete, it calls a 'moveend' event.
        map.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    // Pause spinning on interaction
    map.on("mousedown", () => {
      userInteracting = true;
    });

    // Restart spinning the globe when interaction is complete
    map.on("mouseup", () => {
      userInteracting = false;
      spinGlobe();
    });

    // These events account for cases where the mouse has moved
    // off the map, so 'mouseup' will not be fired.
    map.on("dragend", () => {
      userInteracting = false;
      spinGlobe();
    });
    map.on("pitchend", () => {
      userInteracting = false;
      spinGlobe();
    });
    map.on("rotateend", () => {
      userInteracting = false;
      spinGlobe();
    });

    // When animation is complete, start spinning if there is no ongoing interaction
    map.on("moveend", () => {
      spinGlobe();
    });

    spinGlobe();
    // Clean up on component unmount
    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} style={{ height: "100vh" }} />;
};

export default MapboxMap;
