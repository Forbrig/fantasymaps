"use client";

import { useRef, useState } from "react";
import { Map, MapLayerMouseEvent, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import bbox from "@turf/bbox";
// import Link from "next/link";

import styles from "./page.module.scss";

export default function Home() {
  const mapRef = useRef<MapRef>(null);
  const [zoom, setZoom] = useState(0);
  const [cursor, setCursor] = useState("default");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleMapClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (feature) {
      if (
        feature.layer.id === "location-circles" ||
        feature.layer.id === "location-labels"
      ) {
        const locationName = feature.properties.name;
        const description = feature.properties.description;
        const [minLng, minLat, maxLng, maxLat] = bbox(feature);

        setSelectedLocation(locationName);

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

      {/* <Link href="/editor" className={styles.editorLink}>
        Open Editor
      </Link> */}

      {selectedLocation && (
        <div className={styles.location}>
          <div className={styles.title}>{selectedLocation}</div>
          <div className={styles.info}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
            risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
            nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
            ligula massa, varius a, semper congue, euismod non, mi. Proin
            porttitor, orci nec nonummy molestie, enim est eleifend mi, non
            fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa,
            scelerisque vitae, consequat in, pretium a, enim. Pellentesque
            congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum
            bibendum augue. Praesent egestas leo in pede. Praesent blandit odio
            eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum
            ante ipsum primis in faucibus orci luctus et ultrices posuere
            cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque
            fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
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
        renderWorldCopies={false}
        cursor={cursor}
        dragRotate={false}
        touchZoomRotate={false}
        onMove={(event) => setZoom(event.viewState.zoom)}
      />
    </div>
  );
}
