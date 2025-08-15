"use client";

import { useState } from "react";
import { Map } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import styles from "./page.module.scss";

export default function Home() {
  const [zoom, setZoom] = useState(0);
  const [cursor, setCursor] = useState("default");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleMapClick = (event: { features?: unknown[] }) => {
    const features = event.features;
    if (features && features.length > 0) {
      const feature = features[0] as {
        layer: { id: string };
        properties: { name: string; type: string; description: string };
        geometry: { coordinates: number[] };
      };

      if (
        feature.layer.id === "location-circles" ||
        feature.layer.id === "location-labels"
      ) {
        const locationName = feature.properties.name;
        const description = feature.properties.description;

        setSelectedLocation(locationName);
        console.log("Location clicked!", {
          name: locationName,
          type: feature.properties.type,
          description: description,
          coordinates: feature.geometry.coordinates,
          timestamp: new Date().toISOString(),
        });
      }
    }
  };

  const onMouseEnter = () => setCursor("pointer");
  const onMouseLeave = () => setCursor("auto");

  return (
    <div className={styles.page}>
      <div className={styles.zoomInfo}>Zoom: {zoom.toFixed(2)}</div>

      {selectedLocation && (
        <div className={styles.locationInfo}>Selected: {selectedLocation}</div>
      )}

      <Map
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 0,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="./styles.json"
        minZoom={-2}
        maxZoom={2}
        interactiveLayerIds={["location-circles", "location-labels"]}
        onClick={handleMapClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        // renderWorldCopies={false}
        cursor={cursor}
        dragRotate={false}
        touchZoomRotate={false}
      />
    </div>
  );
}
