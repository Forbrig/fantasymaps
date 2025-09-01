"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";

import { useMap } from "@/context/MapProvider";

import { Map } from "@/components/Map";
import { Search } from "@/components/Search";

import styles from "./page.module.scss";

export default function Home() {
  const {
    zoom,
    selectedLocation,
    selectedLocationType,
    selectedLocationDescription,
  } = useMap();

  return (
    <div className={styles.page}>
      <div className={styles.zoomInfo}>Zoom: {zoom.toFixed(2)}</div>

      <Link href="/editor" className={styles.editorLink}>
        Open Editor
      </Link>

      <div className={styles.search}>
        <Search />
      </div>

      {selectedLocation && (
        <div className={styles.location}>
          <div className={styles.title}>{selectedLocation}</div>
          <div className={styles.type}>{selectedLocationType || "Unknown"}</div>
          <div className={styles.info}>
            {selectedLocationDescription || "No description available."}
          </div>
        </div>
      )}

      <Map />
    </div>
  );
}
