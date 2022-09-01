import {
  Map,
  GeolocateControl,
  NavigationControl,
  MapProvider,
  useControl,
} from "react-map-gl";
import { useRef, useCallback, useState } from "react";
import "@aws-amplify/ui-react/styles.css";
import "maplibre-gl/dist/maplibre-gl.css";
import Amplify from "aws-amplify";
import awsconfig from "../aws-exports";
import useGeofence from "./useGeofence";
import { Flex, Text } from "@aws-amplify/ui-react";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl/dist/mapbox-gl.css";

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { MapRef, ControlPosition } from "react-map-gl";
import Mapbox from "react-map-gl/dist/esm/mapbox/mapbox";
import maplibregl from "maplibre-gl";

function GeoMap() {
  const DrawControl = (props) => {
    useControl<MapboxDraw>(
      () => new MapboxDraw(props),
      ({ map }: { map: MapRef }) => {
        //map.on("draw.create", props.onCreate);
        //map.on("draw.update", props.onUpdate);
        //map.on("draw.delete", props.onDelete);
      },
      ({ map }: { map: MapRef }) => {
        ///map.off("draw.create", props.onCreate);
        ///map.off("draw.update", props.onUpdate);
        ///map.off("draw.delete", props.onDelete);
      },
      { position: props.position }
    );
    return null;
  };

  return (
    <>
      {true ? (
        <>
          <Map
            style={{ width: "100vw", height: "100vh" }}
            initialViewState={{
              longitude: 140.343062,
              latitude: 35.726786,
              zoom: 10,
            }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapLib={maplibregl}
            mapboxAccessToken="pk.eyJ1Ijoic3MwOTg3NTE5MDBzcyIsImEiOiJjbDVyNjllejEyNGF2M2Jyb25zZzM4M2Y0In0.A4sZaXQPpyTCy5cWGm750w"
          >
            <GeolocateControl />
            <NavigationControl />
            <DrawControl
              position="top-left"
              displayControlsDefault={false}
              controls={{
                polygon: true,
                point: true,
                uncombine_features: true,
                trash: true,
              }}
              defaultMode="draw_polygon"
            />
          </Map>
        </>
      ) : (
        <Flex
          justifyContent="center"
          alignItems="center"
          width="100vw"
          height="calc(100vh - var(--amplify-space-xxl))"
        >
          <Text size="large">Loading...</Text>
        </Flex>
      )}
    </>
  );
}

export default GeoMap;
