import React, { useState } from "react";
import { getTown, getWeather } from "../../APIcalls";
import { Output } from "../output/Output";

export const Input = () => {
  const [inputTown, setInputTown] = useState("");
  const [selectTown, setSelectedTown] = useState("");
  const [weather, setWeather] = useState(null);

  const townEntered = async () => {
    // console.log("entered", inputTown);
    let loadTown = await getTown(inputTown);
    setSelectedTown(loadTown);
    if (selectTown !== undefined) {
      fetchWeather(loadTown);
    }
  };

  const fetchWeather = async (e) => {
    let loadWeather = await getWeather(e[0].lat, e[0].lon);
    setWeather(loadWeather);
  };

  return (
    <div>
      {/* possibly address-level2  */}
      <input
        type='text'
        autoComplete='address-level2'
        onInput={(e) => setInputTown(e.target.value)}
      />
      <button type='button' className='btnTown' onClick={townEntered}>
        Enter
      </button>
      <Output selectTown={selectTown} weather={weather} />
    </div>
  );
};
