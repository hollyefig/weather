import React, { useState, useEffect, useCallback, useRef } from "react";

import nightBg from "./IMGs/night.png";
import sunriseBg from "./IMGs/sunriseBg.png";
import sunsetBg from "./IMGs/sunsetBg.png";
import defaultBg from "./IMGs/defaultBG.png";

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
  const [themeBg, setThemeBg] = useState(defaultBg);

  const doc = document.documentElement;
  const countryRef = useRef(null);

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

  // ! determine time of day for visual UI shifts
  const getDayTime = useCallback(() => {
    let current = weather.current.dt;
    let sunrise = weather.current.sunrise;
    let sunset = weather.current.sunset;
    let twoHours = 7200;

    // ? dark
    if (current <= sunrise || current >= sunset + twoHours) {
      doc.className = "night";
      setThemeBg(nightBg);
    }
    // ? morning
    else if (current >= sunrise && current <= sunrise + twoHours) {
      doc.className = "sunrise";
      setThemeBg(sunriseBg);
    }
    // ? daytime (default)
    else if (current >= sunrise + twoHours && current <= sunset - twoHours) {
      doc.className = "default";
      setThemeBg(defaultBg);
    }
    // ? sunset
    else if (current >= sunset - twoHours && current <= sunset + twoHours) {
      doc.className = "sunset";
      setThemeBg(sunsetBg);
    }
  }, [weather, doc, setThemeBg]);

  // * USE EFFECT
  useEffect(() => {
    doc.className = "default";
    // ? when enter key is hit
    const enterKey = (k) => {
      k.key === "Enter" && townEntered();
    };
    document.addEventListener("keydown", enterKey);

    // ? set off country code func
    countryCodeFunc();

    // ? get day time for UI shift
    weather && getDayTime();

    return () => document.removeEventListener("keydown", enterKey);
  }, [townEntered, countryCodeFunc, getDayTime, weather, doc]);

  // * RETURN
  return (
    <div className='App' style={{ backgroundImage: `url('${themeBg}')` }}>
      <div className='backdropBlur'>
        <Input
          setInputTown={setInputTown}
          inputCountry={inputCountry}
          setInputCountry={setInputCountry}
          townEntered={townEntered}
          setIsUS={setIsUS}
          countryRef={countryRef}
        />
        <Output
          selectTown={selectTown}
          weather={weather}
          deg={deg}
          countryRef={countryRef}
        />
      </div>
    </div>
  );
}

export default App;
