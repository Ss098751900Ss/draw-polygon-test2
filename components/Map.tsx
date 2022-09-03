import {
  Map,
  GeolocateControl,
  NavigationControl,
  MapProvider,
  useControl,
  FullscreenControl,
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
import DrawPolygon from "@mapbox/mapbox-gl-draw/src/modes/draw_polygon";

function GeoMap() {
  const [features, setFeatures] = useState({});
  var mapRef = useRef();
  var drawRef = useRef();

  const onUpdate = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      console.log("event", e);
      console.log("e.features", e.features);
      console.log("onUpdate newFeatures", newFeatures);
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      console.log("onDelete newFeatures", newFeatures);
      return newFeatures;
    });
  }, []);

  const DrawControl = (props) => {
    useControl<MapboxDraw>(
      () => {
        const draw = new MapboxDraw(props);
        console.log("response", draw.modes);
        drawRef.current = draw;
        console.log("drawRef.current", drawRef.current);
        return draw;
      },
      ({ map }: { map: MapRef }) => {
        map.on("draw.create", props.onCreate);
        map.on("draw.update", props.onUpdate);
        map.on("draw.delete", props.onDelete);
      },
      ({ map }: { map: MapRef }) => {
        map.off("draw.create", props.onCreate);
        map.off("draw.update", props.onUpdate);
        map.off("draw.delete", props.onDelete);
      },
      { position: props.position }
    );
    return null;
  };

  const EventFireButton = () => {
    function fireEvent() {
      console.log("event fired!");

      let e = new Event("draw.update");
      let target = document.getElementById("root");
      target.dispatchEvent(e);
      try {
        //if (target.dispatchEvent(e)) console.log("Event Success");
        target.dispatchEvent(e);
      } catch (e) {
        console.log("error occured!:", e);
      }
    }

    return <button onClick={fireEvent}>EventFireButton</button>;
  };

  const GetSourceButton = () => {
    function getSource() {
      try {
        const map = mapRef.current;
        const maphoge = mapRef.current.getMap();
        console.log("map", map);
        console.log("maphoge", maphoge);
        const source = mapRef.current.getFeatureState({ source: "polygon" });
        console.log("source", source);
      } catch (e) {
        console.log(e);
      }
      //console.log(map);
      //console.log(maphoge);
      //const source = map.getFeatureState("polygon");
      //console.log(source);
    }
    return <button onClick={getSource}>GetSourceButton</button>;
  };

  const DrawPolygonButton = () => {
    function drawPolygon() {
      console.log(DrawPolygon);
    }
    return <button onClick={drawPolygon}>DrawPolygonButton</button>;
  };

  const ChangeModeButton = () => {
    function changeMode() {
      drawRef.current.changeMode("draw_line_string");
    }
    return <button onClick={changeMode}>ChangeModeButton</button>;
  };

  const SetNewFeaturesButton = () => {
    function setNewFeatures() {
      try {
        drawRef.current.set({
          type: "FeatureCollection",
          features: [
            {
              geometry: {
                coordinates: [
                  [
                    [140.34817950045505, 35.786802011468026],
                    [140.38019728820643, 35.81617056341929],
                    [140.41412089665693, 35.76732003753233],
                    [140.41107158353918, 35.743502254231785],
                    [140.39201337654356, 35.731745396470075],
                    [140.37257400540778, 35.75525737594259],
                    [140.34817950045505, 35.786802011468026],
                  ],
                ],
                type: "Polygon",
              },
              id: "renderingPolygonTest",
              properties: {},
              type: "Feature",
            },
          ],
        });
        console.log("sucess!");
      } catch (e) {
        console.log(e);
      }
    }
    return <button onClick={setNewFeatures}>SetNewFeaturesButton</button>;
  };

  return (
    <>
      {true ? (
        <>
          <EventFireButton />
          <GetSourceButton />
          <DrawPolygonButton />
          <ChangeModeButton />
          <SetNewFeaturesButton />
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
            ref={mapRef}
          >
            <GeolocateControl />
            <NavigationControl />
            <DrawControl
              position="top-left"
              displayControlsDefault={false}
              controls={{
                polygon: true,
                point: true,
                trash: true,
              }}
              defaultMode="simple_select"
              onCreate={onUpdate}
              onUpdate={onUpdate}
              onDelete={onDelete}
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
