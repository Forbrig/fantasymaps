import { ChangeEvent, useState } from "react";

import styles from "./Search.module.scss";

interface Location {
  name: string;
}

const locations: Location[] = [
  {
    name: "Valhala",
  },
  { name: "Isengard" },
  { name: "Isengard2" },
  {
    name: "Shire",
  },
];

export const Search = () => {
  const [input, setInput] = useState<string>("");
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    if (input?.length > 2) {
      setFilteredLocations(
        locations.filter((location) =>
          location.name
            .toLocaleLowerCase()
            .startsWith(input.toLocaleLowerCase())
        )
      );
    } else {
      setFilteredLocations([]);
    }
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
            <li key={key}>{location.name}</li>
          ))}

          {!filteredLocations.length && <li>Type to search...</li>}
        </ul>
      )}
    </div>
  );
};
