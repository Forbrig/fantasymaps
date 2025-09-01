import { useMap } from "@/context/MapProvider";
import { Map as MapLibre, MapLayerMouseEvent } from "react-map-gl/maplibre";
import bbox from "@turf/bbox";

export const Map = () => {
  const {
    mapRef,
    mapStyle,
    setSelectedLocation,
    setSelectedLocationDescription,
    setSelectedLocationType,
    setCursor,
    cursor,
    setZoom,
  } = useMap();

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
      }
    } else {
      setSelectedLocation(null);
    }
  };

  const onMouseEnter = () => setCursor("pointer");
  const onMouseLeave = () => setCursor("auto");

  if (!mapStyle) return null;

  return (
    <MapLibre
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      // renderWorldCopies={false}
      cursor={cursor}
      dragRotate={false}
      touchZoomRotate={false}
      onMove={(event) => setZoom(event.viewState.zoom)}
    />
  );
};
