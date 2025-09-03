import { ChangeEvent, useState } from "react";

import { useMap, MapLocation } from "@/context/MapProvider";

import styles from "./Search.module.scss";

export const Search = () => {
  const { locations, mapRef } = useMap();
  const [input, setInput] = useState<string>("");
  const [filteredLocations, setFilteredLocations] = useState<MapLocation[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    if (input?.length > 2) {
      setFilteredLocations(
        locations.filter((location) =>
          location.name
            ?.toLocaleLowerCase()
            .startsWith(input.toLocaleLowerCase())
        )
      );
    } else {
      setFilteredLocations([]);
    }
  };

  const handleLocationClick = (location: MapLocation) => {
    mapRef?.current?.flyTo({
      center: location.coordinates,
      zoom: 2,
    });

    setInput(location.name || "");
    setFilteredLocations([]);
    setIsInputFocused(false);
  };

  return (
    <div className={styles.search}>
      <input
        type="text"
        placeholder="Search for a location..."
        className={styles.input}
        onChange={handleSearchChange}
        value={input}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
      />

      {isInputFocused && (
        <ul className={styles.filtered}>
          {filteredLocations.map((location, key) => (
            <li key={key} onMouseDown={() => handleLocationClick(location)}>
              {location.name}
            </li>
          ))}

          {!filteredLocations.length && <li>Type to search...</li>}
        </ul>
      )}
    </div>
  );
};
