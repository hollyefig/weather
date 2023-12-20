import React, { useState, useEffect, useCallback, useRef } from "react";
import { gsap } from "gsap";
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
  const [deg, setDeg] = useState("far");
  const [tempUnit, setTempUnit] = useState(true); //true = imperial, false = metric

  const [themeBg, setThemeBg] = useState(defaultBg);
  // for storage
  const [favorites, setFavorites] = useState([]);

  // refs
  const doc = document.documentElement;
  const countryRef = useRef(null);
  const hiddenInputsRef = useRef(null);
  const favArrow = useRef(null);

  // create 2 API calls dpeneding on C or F
  // & fetch weather
  const fetchWeather = useCallback(async (e) => {
    let loadWeather = await getWeather(e.lat, e.lon);
    setWeather(loadWeather);
  }, []);

  // & when town is read
  const townEntered = useCallback(
    async (name) => {
      console.log("town entered");
      let loadTown;
      // ! for string / letters input
      if (isNaN(parseInt(name))) {
        if (name !== null && name !== "") {
          if (isUS) {
            loadTown = await getTown(name);
            setSelectedTown(...loadTown);
            // ensure data is found before sending off
            if (loadTown.length !== 0) {
              fetchWeather(...loadTown);
            }
          }
          // ! Non US zip with letters
          else {
            let zip = name.replace(" ", "+");
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
        let parseZip = parseInt(name);
        // ? ensure it's a 5-digit zip (US only)
        if (isUS) {
          if (name.length === 5) {
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
          name.includes("-")
            ? (loadZip = await getZip(`${name},${countryCode}`))
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
    },
    [countryCode, isUS, fetchWeather]
  );

  // ! get country code
  const countryCodeFunc = useCallback(async () => {
    if (inputCountry) {
      let loadCode = await getCountryCode(inputCountry);
      setCountryCode(loadCode[0].cca2);
    }
  }, [inputCountry]);

  // ! determine time of day for visual UI shifts
  const getDayTime = useCallback(() => {
    let current = weather[deg].current.dt;
    let sunrise = weather[deg].current.sunrise;
    let sunset = weather[deg].current.sunset;
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
  }, [weather, doc, setThemeBg, deg]);

  // & add location to favorites
  const addToFavs = () => {
    // ? check if item was already added
    let isMatch;
    let num;
    if (sessionStorage.length !== 0) {
      Object.keys(sessionStorage).forEach((e, index) => {
        if (
          JSON.parse(sessionStorage.getItem(`fav${index}`)).name ===
          selectTown.name
        ) {
          isMatch = true;
          num = index;
        }
      });
    }

    // add to sesh storage
    if (!isMatch) {
      const input = {
        name: selectTown.name,
        forecast: weather,
      };

      const stringObj = JSON.stringify(input);
      sessionStorage.setItem(`fav${sessionStorage.length}`, stringObj);
      // ! get sessionStorage, update state
      const sessionStorageKeys = Object.keys(sessionStorage);
      const favoritesData = sessionStorageKeys.map((key) =>
        JSON.parse(sessionStorage.getItem(key))
      );
      setFavorites(favoritesData);
    }
    // remove from sesh storage if item was already added
    else {
      removeFav(`fav${num}`);
    }
  };

  // & remove favorite
  const removeFav = (key) => {
    let removeNum = parseInt(key.slice(3));

    sessionStorage.removeItem(key);

    const storageKeys = Object.keys(sessionStorage);

    storageKeys.forEach((key, index) => {
      const newName = `fav${index}`;
      const value = JSON.parse(sessionStorage.getItem(key));

      // Update sessionStorage with the new key
      sessionStorage.removeItem(key);
      sessionStorage.setItem(newName, JSON.stringify(value));
    });

    // Update state to trigger re-render
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter((e, i) => {
        return i !== removeNum;
      });
      return updatedFavorites;
    });
  };

  // & clicked menu dropdown
  const burgerClicked = () => {
    let favArrowDown =
      getComputedStyle(favArrow.current).transform ===
      "matrix(0, 1, -1, 0, 0, 0)";
    let currentHeight = getComputedStyle(hiddenInputsRef.current).height;

    gsap
      .timeline({ defaults: { duration: 0.3 } })
      .to(".hiddenInputs", {
        height: currentHeight === "0px" ? "auto" : 0,
      })
      .to(
        ".input",
        {
          backgroundColor:
            currentHeight === "0px" ? "#0000002e" : "transparent",
        },
        "<"
      )
      .to(".favsList", { height: currentHeight !== "0px" && "0px" }, "<")
      .add(
        // if logic passes, fav arrow must rotate up
        () =>
          currentHeight !== "0px" &&
          favArrowDown &&
          gsap.to("#favArrow", { rotate: 0 }),
        "<"
      );
  };

  // * USE EFFECT
  useEffect(() => {
    // ? hit enter key to search
    const hitEnter = (e) => {
      e.key === "Enter" && townEntered(inputTown);
    };
    document.addEventListener("keydown", hitEnter);
    doc.className = "default";

    // ? set off country code func
    countryCodeFunc();

    // ? get day time for UI shift
    weather && getDayTime();

    // ! get sessionStorage, update state
    const sessionStorageKeys = Object.keys(sessionStorage);
    const favoritesData = sessionStorageKeys.map((key) =>
      JSON.parse(sessionStorage.getItem(key))
    );
    setFavorites(favoritesData);

    return () => document.removeEventListener("keydown", hitEnter);

    // * END USEEFFECT
  }, [
    townEntered,
    inputTown,
    countryCodeFunc,
    getDayTime,
    weather,
    doc,
    setFavorites,
  ]);

  // * RETURN
  return (
    <div className='App' style={{ backgroundImage: `url('${themeBg}')` }}>
      <Input
        inputTown={inputTown}
        setInputTown={setInputTown}
        inputCountry={inputCountry}
        setInputCountry={setInputCountry}
        townEntered={townEntered}
        setIsUS={setIsUS}
        countryRef={countryRef}
        deg={deg}
        setDeg={setDeg}
        setTempUnit={setTempUnit}
        favorites={favorites}
        setFavorites={setFavorites}
        removeFav={removeFav}
        hiddenInputsRef={hiddenInputsRef}
        burgerClicked={burgerClicked}
        favArrow={favArrow}
        tempUnit={tempUnit}
      />
      {selectTown && weather && (
        <Output
          selectTown={selectTown}
          weather={weather}
          deg={deg}
          addToFavs={addToFavs}
          favorites={favorites}
          hiddenInputsRef={hiddenInputsRef}
          burgerClicked={burgerClicked}
          tempUnit={tempUnit}
        />
      )}
    </div>
  );
}

export default App;
