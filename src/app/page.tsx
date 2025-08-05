"use client";

import { useState } from "react";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import styles from "./page.module.scss";

export default function Home() {
  const [zoom, setZoom] = useState(0);

  return (
    <div className={styles.page}>
      {/* Zoom level display */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "4px",
          fontSize: "14px",
          fontFamily: "monospace",
          zIndex: 1000,
        }}
      >
        Zoom: {zoom.toFixed(2)}
      </div>

      <Map
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 0,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="/styles.json"
        minZoom={-2}
        maxZoom={2}
        // renderWorldCopies={false}
        onMove={(event) => setZoom(event.viewState.zoom)}
      />
    </div>
  );
}
