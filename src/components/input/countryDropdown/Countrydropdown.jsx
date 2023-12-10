import React, { useState, useEffect } from "react";
import Select from "react-select";
import { getCountryList } from "../../../APIcalls";

export const Countrydropdown = ({
  setInputCountry,
  countryRef,
  inputCountry,
}) => {
  const [sortedArray, setSortedArray] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

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

  // prep for react-select
  const options = sortedArray.map((country) => ({
    value: country,
    label: country,
  }));

  // country selected
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setInputCountry(selectedOption.value);
  };

  return (
    <div className='countryDropdown' ref={countryRef}>
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
        placeholder='Select a country'
      />
    </div>
  );
};
