import React, { useState, useEffect } from "react";
import { getCountryList } from "../../../APIcalls";

export const Countrydropdown = ({ setInputCountry, inputCountry }) => {
  const [sortedArray, setSortedArray] = useState([]);

  // ! get country list
  const importCountries = async () => {
    let loadList = await getCountryList();
    let arr = [];
    loadList.forEach((e) => {
      arr.push(e.name.common);
    });
    return arr.sort();
  };

  // invoke function to populate dropdown
  useEffect(() => {
    const fetchData = async () => {
      let sorted = await importCountries();
      setSortedArray(sorted);
    };

    fetchData();
  }, []);

  // country selected
  const selectedCountry = async (e) => {
    setInputCountry(e.target.value);
  };

  return (
    <div>
      <select
        autoComplete='country'
        className='inputCountry'
        onInput={(e) => selectedCountry(e)}
        value={inputCountry}
      >
        {sortedArray.map((e) => {
          return (
            <option key={e} value={e}>
              {e}
            </option>
          );
        })}
      </select>
    </div>
  );
};
