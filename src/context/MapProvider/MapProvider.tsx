"use client";

import { GeoJsonProperties } from "geojson";
import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { MapRef, StyleSpecification } from "react-map-gl/maplibre";

export type MapLocation = NonNullable<GeoJsonProperties> & {
  id: string;
  name?: string;
  type?: string;
  description?: string;
  coordinates?: [number, number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  features: any[];
};

interface MapContextProps {
  mapRef: RefObject<MapRef | null>;
  mapStyle: StyleSpecification | undefined;
  setMapStyle: Dispatch<SetStateAction<StyleSpecification | undefined>>;

  zoom: number;
  setZoom: (zoom: number) => void;
  cursor: string;
  setCursor: (cursor: string) => void;
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => void;
  selectedLocationDescription: string | null;
  setSelectedLocationDescription: (description: string | null) => void;
  selectedLocationType: string | null;
  setSelectedLocationType: (type: string | null) => void;

  locations: MapLocation[];
  setLocations: Dispatch<SetStateAction<MapLocation[]>>;
}

const initialProps: MapContextProps = {
  mapRef: { current: null },
  mapStyle: undefined,
  setMapStyle: () => {},
  zoom: 0,
  setZoom: () => {},
  cursor: "default",
  setCursor: () => {},
  selectedLocation: null,
  setSelectedLocation: () => {},
  selectedLocationDescription: null,
  setSelectedLocationDescription: () => {},
  selectedLocationType: null,
  setSelectedLocationType: () => {},
  locations: [],
  setLocations: () => {},
};

const mapContext = createContext<MapContextProps>(initialProps);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const mapRef = useRef<MapRef>(null);
  const [mapStyle, setMapStyle] = useState<StyleSpecification | undefined>();

  const [zoom, setZoom] = useState(0);
  const [cursor, setCursor] = useState("default");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedLocationDescription, setSelectedLocationDescription] =
    useState<string | null>(null);
  const [selectedLocationType, setSelectedLocationType] = useState<
    string | null
  >(null);

  const [locations, setLocations] = useState<MapLocation[]>([]);

  const value: MapContextProps = {
    mapRef,
    mapStyle,
    setMapStyle,
    zoom,
    setZoom,
    cursor,
    setCursor,
    selectedLocation,
    setSelectedLocation,
    selectedLocationDescription,
    setSelectedLocationDescription,
    selectedLocationType,
    setSelectedLocationType,
    locations,
    setLocations,
  };

  useEffect(() => {
    const loadStylesData = async () => {
      try {
        const response = await fetch("./styles.json");
        const stylesData: StyleSpecification = await response.json();

        setMapStyle(stylesData);

        // Extract locations from the GeoJSON source
        if (
          stylesData.sources?.locations &&
          "data" in stylesData.sources.locations
        ) {
          const locationSource = stylesData.sources.locations
            .data as MapLocation;

          if ("features" in locationSource) {
            const loadedLocations = locationSource.features.map(
              (feature, index: number) => ({
                id: feature.properties?.id || `${index + 1}`,
                name: feature.properties?.name,
                type: feature.properties?.type,
                description: feature.properties?.description,
                coordinates:
                  feature.geometry.type === "Point"
                    ? (feature.geometry.coordinates as [number, number])
                    : undefined,
                features: [],
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

  return <mapContext.Provider value={value}>{children}</mapContext.Provider>;
};

export const useMap = () => {
  return useContext(mapContext);
};
