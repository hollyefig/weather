import React, { useState, useEffect, useCallback } from "react";
// get componenets
import { Input } from "./components/input/Input";
import { Output } from "./components/output/Output";
// get APIs
import { getCountryCode, getTown, getWeather, getZip } from "./APIcalls";

function App() {
  const [inputTown, setInputTown] = useState(null);
  const [inputCountry, setInputCountry] = useState("United States");
  const [selectTown, setSelectedTown] = useState(null);
  const [weather, setWeather] = useState(null);
  const [countryCode, setCountryCode] = useState(null);
  const [isUS, setIsUS] = useState(true);
  const [deg, setDeg] = useState("˚F");

  // & when town is read
  const townEntered = useCallback(async () => {
    let loadTown;
    // ! for string / letters input
    if (isNaN(parseInt(inputTown))) {
      if (inputTown !== null && inputTown !== "") {
        if (isUS) {
          loadTown = await getTown(inputTown);
          setSelectedTown(...loadTown);
          // ensure data is found before sending off
          if (loadTown.length !== 0) {
            fetchWeather(...loadTown);
          }
        }
        // ! Non US zip with letters
        else {
          let zip = inputTown.replace(" ", "+");
          let loadZip = await getZip(`${zip},${countryCode}`);
          if (loadZip) {
            loadTown = await getTown(loadZip.name);
            setSelectedTown(...loadTown);

            // ensure there is data
            if (loadTown !== undefined) {
              // fetch weather
              fetchWeather(...loadTown);
            }
          }
        }
      }
    }
    // ! for zip input
    else {
      let parseZip = parseInt(inputTown);
      // ? ensure it's a 5-digit zip (US only)
      if (isUS) {
        if (inputTown.length === 5) {
          let loadZip = await getZip(parseZip);
          loadTown = await getTown(loadZip.name);
          setSelectedTown(...loadTown);
          // ensure there is data
          if (loadTown !== undefined) {
            fetchWeather(...loadTown);
          }
        }
      }
      // ? if non US zip code
      else if (!isUS) {
        let loadZip;
        // adjust if there's a "-" (ex: japan)
        inputTown.includes("-")
          ? (loadZip = await getZip(`${inputTown},${countryCode}`))
          : (loadZip = await getZip(`${parseZip},${countryCode}`));

        if (loadZip) {
          loadTown = await getTown(loadZip.name);
          setSelectedTown(...loadTown);

          // ensure there is data
          if (loadTown !== undefined) {
            // fetch weather
            fetchWeather(...loadTown);
          }
        }
      }
    }
  }, [inputTown, countryCode, isUS]);

  // ! get country code
  const countryCodeFunc = useCallback(async () => {
    if (inputCountry) {
      let loadCode = await getCountryCode(inputCountry);
      setCountryCode(loadCode[0].cca2);
    }
  }, [inputCountry]);

  // & fetch weather
  const fetchWeather = async (e) => {
    let loadWeather = await getWeather(e.lat, e.lon);
    setWeather(loadWeather);
  };

  // ? when enter key is hit
  useEffect(() => {
    const enterKey = (k) => {
      k.key === "Enter" && townEntered();
    };
    document.addEventListener("keydown", enterKey);

    countryCodeFunc();
    return () => document.removeEventListener("keydown", enterKey);
  }, [townEntered, countryCodeFunc]);

  // * RETURN
  return (
    <div className='App'>
      <Input
        setInputTown={setInputTown}
        inputCountry={inputCountry}
        setInputCountry={setInputCountry}
        townEntered={townEntered}
        setIsUS={setIsUS}
      />
      <Output selectTown={selectTown} weather={weather} deg={deg} />
    </div>
  );
}

export default App;