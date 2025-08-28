"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import styles from "./MapEditor.module.scss";
import Map, { MapRef, MapLayerMouseEvent } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { StyleSpecification } from "maplibre-gl";

interface Location {
  id: string;
  name: string;
  type: "city" | "region" | "landmark";
  description: string;
  coordinates: [number, number];
}

interface MapEditorProps {
  onStyleChange?: (style: StyleSpecification) => void;
}

export default function MapEditor({ onStyleChange }: MapEditorProps) {
  const mapRef = useRef<MapRef>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [mapStyle, setMapStyle] = useState<StyleSpecification | null>(null);
  const [baseMapStyle, setBaseMapStyle] = useState<StyleSpecification | null>(
    null
  );

  // Generate dynamic map style with current locations
  const getDynamicMapStyle = useCallback((): StyleSpecification | null => {
    if (!baseMapStyle) return null;

    return {
      ...baseMapStyle,
      sources: {
        ...baseMapStyle.sources,
        locations: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: locations.map((loc) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: loc.coordinates,
              },
              properties: {
                id: loc.id,
                name: loc.name,
                type: loc.type,
                description: loc.description,
              },
            })),
          },
        },
      },
    };
  }, [baseMapStyle, locations]);

  // Update map style whenever locations change
  useEffect(() => {
    const dynamicStyle = getDynamicMapStyle();
    if (dynamicStyle) {
      setMapStyle(dynamicStyle);
      if (onStyleChange) {
        onStyleChange(dynamicStyle);
      }
    }
  }, [getDynamicMapStyle, onStyleChange]);

  // Load geo data from styles.json
  useEffect(() => {
    const loadStylesData = async () => {
      try {
        const response = await fetch("./styles.json");
        const stylesData: StyleSpecification = await response.json();
        setBaseMapStyle(stylesData);

        // Extract locations from the GeoJSON source
        if (
          stylesData.sources?.locations &&
          "data" in stylesData.sources.locations
        ) {
          const locationSource = stylesData.sources.locations.data as {
            type: string;
            features: Array<{
              type: string;
              geometry: { type: string; coordinates: [number, number] };
              properties: {
                id?: string;
                name: string;
                type?: string;
                description: string;
              };
            }>;
          };
          if (locationSource.features) {
            const loadedLocations: Location[] = locationSource.features.map(
              (feature, index: number) => ({
                id: feature.properties.id || `${index + 1}`,
                name: feature.properties.name,
                type:
                  (feature.properties.type as "city" | "region" | "landmark") ||
                  "landmark",
                description: feature.properties.description,
                coordinates: feature.geometry.coordinates,
              })
            );
            setLocations(loadedLocations);
          }
        }
      } catch (error) {
        console.error("Failed to load styles.json:", error);
        // Fallback to empty locations if loading fails
        setLocations([]);
      }
    };

    loadStylesData();
  }, []);

  const [editMode, setEditMode] = useState<"view" | "add-location">("view");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [draggedLocationId, setDraggedLocationId] = useState<string | null>(
    null
  );

  const handleMapClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const { lngLat, features } = event;

      if (editMode === "add-location") {
        const newLocation: Location = {
          id: Date.now().toString(),
          name: `New Location ${locations.length + 1}`,
          type: "city",
          description: "A new location",
          coordinates: [lngLat.lng, lngLat.lat],
        };
        setLocations([...locations, newLocation]);
        setEditMode("view");
      } else if (features && features.length > 0) {
        const feature = features[0];
        if (
          feature.layer.id === "location-circles" ||
          feature.layer.id === "location-labels"
        ) {
          const location = locations.find(
            (loc) => loc.id === feature.properties.id
          );
          setSelectedLocation(location || null);
        }
      }
    },
    [editMode, locations]
  );

  const handleMouseDown = useCallback((event: MapLayerMouseEvent) => {
    const { features } = event;
    if (features && features.length > 0) {
      const feature = features[0];
      if (
        feature.layer.id === "location-circles" ||
        feature.layer.id === "location-labels"
      ) {
        setIsDragging(true);
        setDraggedLocationId(feature.properties.id);
        // Prevent map panning while dragging
        if (mapRef.current) {
          mapRef.current.getMap().dragPan.disable();
        }
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (event: MapLayerMouseEvent) => {
      if (isDragging && draggedLocationId) {
        const { lngLat } = event;
        setLocations((prevLocations) =>
          prevLocations.map((loc) =>
            loc.id === draggedLocationId
              ? { ...loc, coordinates: [lngLat.lng, lngLat.lat] }
              : loc
          )
        );

        // Update selected location if it's the one being dragged
        setSelectedLocation((prevSelected) =>
          prevSelected && prevSelected.id === draggedLocationId
            ? { ...prevSelected, coordinates: [lngLat.lng, lngLat.lat] }
            : prevSelected
        );
      }
    },
    [isDragging, draggedLocationId]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDraggedLocationId(null);
      // Re-enable map panning
      if (mapRef.current) {
        mapRef.current.getMap().dragPan.enable();
      }
    }
  }, [isDragging]);

  const updateLocation = (updatedLocation: Location) => {
    setLocations(
      locations.map((loc) =>
        loc.id === updatedLocation.id ? updatedLocation : loc
      )
    );
    setSelectedLocation(updatedLocation);
  };

  const deleteLocation = (id: string) => {
    setLocations(locations.filter((loc) => loc.id !== id));
    setSelectedLocation(null);
  };

  const exportStyle = () => {
    const dynamicStyle = getDynamicMapStyle();
    if (dynamicStyle) {
      const dataStr = JSON.stringify(dynamicStyle, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "map-style.json";
      link.click();
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2>Map Editor</h2>

        {/* Mode Selection */}
        <div className={styles.modeSection}>
          <h3>Mode</h3>
          <select
            value={editMode}
            onChange={(e) =>
              setEditMode(e.target.value as "view" | "add-location")
            }
            className={styles.modeSelect}
          >
            <option value="view">View</option>
            <option value="add-location">Add Location</option>
          </select>
        </div>

        {/* Export */}
        <button onClick={exportStyle} className={styles.exportButton}>
          Export Style JSON
        </button>

        {/* Locations List */}
        <div>
          <h3>Locations ({locations.length})</h3>
          {locations.map((location) => (
            <div
              key={location.id}
              className={
                styles.locationItem +
                (selectedLocation?.id === location.id
                  ? " " + styles.selectedLocation
                  : "")
              }
              onClick={() => setSelectedLocation(location)}
            >
              <strong>{location.name}</strong>
              <div className={styles.locationMeta}>
                {location.type} • [{location.coordinates[0].toFixed(2)},{" "}
                {location.coordinates[1].toFixed(2)}]
              </div>
            </div>
          ))}
        </div>

        {/* Location Editor */}
        {selectedLocation && (
          <div className={styles.locationEditor}>
            <h4>Edit Location</h4>
            <div className={styles.inputGroup}>
              <label>Name:</label>
              <input
                type="text"
                value={selectedLocation.name}
                onChange={(e) =>
                  updateLocation({ ...selectedLocation, name: e.target.value })
                }
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Type:</label>
              <select
                value={selectedLocation.type}
                onChange={(e) =>
                  updateLocation({
                    ...selectedLocation,
                    type: e.target.value as "city" | "region" | "landmark",
                  })
                }
                className={styles.input}
              >
                <option value="city">City</option>
                <option value="region">Region</option>
                <option value="landmark">Landmark</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Description:</label>
              <textarea
                value={selectedLocation.description}
                onChange={(e) =>
                  updateLocation({
                    ...selectedLocation,
                    description: e.target.value,
                  })
                }
                className={styles.textarea}
              />
            </div>
            <button
              onClick={() => deleteLocation(selectedLocation.id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Map */}
      <div className={styles.mapContainer}>
        {mapStyle && (
          <Map
            ref={mapRef}
            initialViewState={{
              longitude: 0,
              latitude: 0,
              zoom: 0,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle={mapStyle}
            minZoom={-2}
            maxZoom={2}
            interactiveLayerIds={["location-circles", "location-labels"]}
            onClick={handleMapClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            cursor={isDragging ? "grabbing" : "default"}
          />
        )}
      </div>
    </div>
  );
}
