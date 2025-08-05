"use client";

import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <Map
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
      />
    </div>
  );
}
