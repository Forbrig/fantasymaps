"use client";

import { useRef, useState } from "react";
import { Map, MapLayerMouseEvent, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import bbox from "@turf/bbox";
import Link from "next/link";

import styles from "./page.module.scss";

export default function Home() {
  const mapRef = useRef<MapRef>(null);
  const [zoom, setZoom] = useState(0);
  const [cursor, setCursor] = useState("default");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedLocationDescription, setSelectedLocationDescription] =
    useState<string | null>(null);
  const [selectedLocationType, setSelectedLocationType] = useState<
    string | null
  >(null);

  const handleMapClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (feature) {
      if (
        feature.layer.id === "location-circles" ||
        feature.layer.id === "location-labels"
      ) {
        const locationName = feature.properties.name;
        const description = feature.properties.description;
        const locationType = feature.properties.type;
        const [minLng, minLat, maxLng, maxLat] = bbox(feature);

        setSelectedLocation(locationName);
        setSelectedLocationDescription(description);
        setSelectedLocationType(locationType);

        mapRef.current?.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          { padding: 40, duration: 1000 }
        );

        console.log("Location clicked!", {
          name: locationName,
          type: feature.properties.type,
          description: description,
          timestamp: new Date().toISOString(),
        });
      }
    } else {
      setSelectedLocation(null);
    }
  };

  const onMouseEnter = () => setCursor("pointer");
  const onMouseLeave = () => setCursor("auto");
  return (
    <div className={styles.page}>
      <div className={styles.zoomInfo}>Zoom: {zoom.toFixed(2)}</div>

      <Link href="/editor" className={styles.editorLink}>
        Open Editor
      </Link>

      {selectedLocation && (
        <div className={styles.location}>
          <div className={styles.title}>{selectedLocation}</div>
          <div className={styles.type}>{selectedLocationType || "Unknown"}</div>
          <div className={styles.info}>
            {selectedLocationDescription || "No description available."}
          </div>
        </div>
      )}

      <Map
        ref={mapRef}
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
        onMove={(event) => setZoom(event.viewState.zoom)}
      />
    </div>
  );
}
