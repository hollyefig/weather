import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
// get componenets
import { Input } from "./components/input/Input";
import { Output } from "./components/output/Output";
// get APIs
import { getTown, getWeather, getZip } from "./APIcalls";

function App() {
  const [inputTown, setInputTown] = useState(null);
  const [selectTown, setSelectedTown] = useState(null);
  const [weather, setWeather] = useState(null);

  // & when town is read
  const townEntered = useCallback(async () => {
    // ! for town input
    if (isNaN(parseInt(inputTown))) {
      if (inputTown !== null && inputTown !== "") {
        let loadTown = await getTown(inputTown);
        setSelectedTown(loadTown);

        // when town is defined, fetch weather
        loadTown !== undefined && fetchWeather(loadTown);
      }
    } else {
      let parseZip = parseInt(inputTown);
      let loadZip = await getZip(parseZip);

      let loadTown = await getTown(loadZip.name);
      setSelectedTown(loadTown);

      // when town is defined, fetch weather
      loadTown !== undefined && fetchWeather(loadTown);
    }
  }, [inputTown]);

  // & fetch weather
  const fetchWeather = async (e) => {
    let loadWeather = await getWeather(e[0].lat, e[0].lon);
    setWeather(loadWeather);
  };

  // ? when enter key is hit
  useEffect(() => {
    const enterKey = (k) => {
      k.key === "Enter" && townEntered();
    };
    document.addEventListener("keydown", enterKey);
    return () => document.removeEventListener("keydown", enterKey);
  }, [townEntered]);
  return (
    <div className='App'>
      <Input setInputTown={setInputTown} townEntered={townEntered} />
      <Output selectTown={selectTown} weather={weather} />
    </div>
  );
}

export default App;
