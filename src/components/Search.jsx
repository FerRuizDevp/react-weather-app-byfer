import { useState } from "react";
import "./search.css";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_API_URL, geoApiOptions } from "../api";

function Search({ onSearchChange }) {
  const [search, setSearch] = useState(null);

  const loadOptions = (inputValue) => {
    return fetch(
      `${GEO_API_URL}/?minPopulation=50000&namePrefix=${inputValue}`,
      geoApiOptions
    )
      .then((response) => response.json())
      .then((response) => {
        return {
          options: response.data?.map((city) => {
            return {
              value: `${city.latitude} ${city.longitude}`,
              label: `${city.name}, ${city.countryCode}`,
            };
          }),
        };
      })
      .catch((error) => console.error(error));
  };

  const handleOnChange = (searchData) => {
    setSearch(searchData);
    onSearchChange(searchData);
  };

  return (
    <div className="search-bar">
      <AsyncPaginate
        placeholder="Search for City..."
        debounceTimeout={600}
        value={search}
        onChange={handleOnChange}
        loadOptions={loadOptions}
        styles={{
          control: (provided) => ({
            ...provided,
            background: "transparent",
            border: "1px solid rgba(187, 187, 187, 0.4)",
            cursor: "pointer",
            color: "white",
          }),
          placeholder: (provided) => ({
            ...provided,
            color: "rgba(187, 187, 187, 0.4)",
          }),
          menu: (provided) => ({
            ...provided,
            background: "rgba(187, 187, 187, 0.4)",
            color: "white",
          }),
          singleValue: (provided) => ({
            ...provided,
            color: "white",
          }),
        }}
      />
    </div>
  );
}

export default Search;
