import { useState, useRef, useEffect, useCallback } from "react";

import { getCountryName } from "../../APIcalls";
import "./output.css";
import { Svg } from "./SVG/Svg";
import { Hourly } from "./children/Hourly";
import { Sect2 } from "./children/Sect2";

export const Output = ({
  selectTown,
  weather,
  deg,
  addToFavs,
  favorites,
  hiddenInputsRef,
  burgerClicked,
  tempUnit,
}) => {
  // & States
  const [countryName, setCountryName] = useState(null);
  const [countryFlag, setCountryFlag] = useState("");
  const [lightHours, setLightHours] = useState(null);
  const [riseSet, setRiseSet] = useState(null);
  const [hourlyArr, setHourlyArr] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [isFav, setIsFav] = useState(false);
  // & Refs
  const tempDivWidth = useRef(null);
  const locDatWrap = useRef(null);
  const favWrap = useRef(null);
  const lightBar = useRef(null);
  const outputRef = useRef(null);

  // ! get country name
  const toCountryName = async () => {
    let countryCode = selectTown.country;
    let loadName = await getCountryName(countryCode);

    setCountryName(loadName[0].name.common);
    setCountryFlag(loadName[0].flags.svg);
  };

  // ! calculate daylight hours
  const daylightHours = useCallback(
    (e) => {
      let set = e.sunset;
      let rise = e.sunrise;
      let seconds = set - rise;
      let min = seconds / 60;
      let hours = Math.floor(min / 60);
      lightBar.current.style.width = (hours / 24) * 100 + "%";
      return hours;
    },
    [lightBar]
  );

  // ! convert UTC to time
  const calculateLocalTime = (timeStamps, timezoneOffset) => {
    let arr = [];

    for (let i = 0; i < timeStamps.length; i++) {
      // Convert UTC timestamp to milliseconds
      const utcMilliseconds = timeStamps[i] * 1000;

      // Apply the timezone offset
      const localMilliseconds = utcMilliseconds + timezoneOffset * 1000;

      // Create a new Date object with the local time
      const localDate = new Date(localMilliseconds);
      arr.push(localDate);
    }

    // Return a Date object with local time
    return arr;
  };
  // ! format time to GMT
  function formatTimeInTimeZone(date, timezone) {
    let arr = [];
    for (let i = 0; i < date.length; i++) {
      const options = {
        hour: "numeric",
        minute: "numeric",
        timeZone: timezone,
        timeZoneName: "short",
      };
      const formattedTime = new Intl.DateTimeFormat("en-US", options).format(
        date[i]
      );
      arr.push(formattedTime.replace(/\bUTC\b/, "").trim());
    }
    return arr;
  }

  // get country name
  if (weather) {
    // console.log("logging", weather);
    toCountryName();
  }

  // ? close burger when clicking output body
  const outputClicked = () => {
    getComputedStyle(hiddenInputsRef.current).height !== "0px" &&
      burgerClicked();
  };

  // * USE EFFECT
  useEffect(() => {
    if (selectTown && weather) {
      // ? set computer width for town/state/country to match temp
      let computed = window.getComputedStyle(tempDivWidth.current);
      locDatWrap.current.style.maxWidth = computed.width;
      locDatWrap.current.style.width = "100%";
      favWrap.current.style.maxWidth = computed.width;
      favWrap.current.style.width = "100%";
      // ? set hours of light in day
      setLightHours(daylightHours(weather[deg].current));

      // ? get rise/set times
      const riseSetTimes = calculateLocalTime(
        [weather[deg].current.sunrise, weather[deg].current.sunset],
        weather[deg].timezone_offset
      );
      // format light/set times to be local to the region
      const gmtFormattedTime = formatTimeInTimeZone(riseSetTimes, "GMT");
      // place rise/set data in this state variable
      setRiseSet(gmtFormattedTime);

      // ? get next 12 hrs
      let hrly = [];
      for (let i = 0; i < 19; i++) {
        hrly.push(weather[deg].hourly[i]);
      }
      setHourlyArr(hrly);

      // ? get current local date
      let date = new Date();
      // format local date to display info
      let time = new Intl.DateTimeFormat("en-GB", {
        minute: "numeric",
        hour: "numeric",
        day: "numeric",
        weekday: "long",
        month: "long",
        year: "numeric",
        timeZone: weather[deg].timezone,
      }).format(date);
      setCurrentDate(time);

      // ? determine if fav'd
      // isFav && setIsFav(false);
      if (selectTown) {
        const curr = selectTown.name;
        const findFav = favorites.some((e) => e.name === curr);
        if (findFav) {
          // is fav
          setIsFav(() => {
            return true;
          });
        } else {
          // is not fav
          setIsFav(() => {
            return false;
          });
        }
      }
      // ! end useEffect
    }
  }, [
    daylightHours,
    setLightHours,
    weather,
    selectTown,
    setRiseSet,
    setHourlyArr,
    setCurrentDate,
    favorites,
    isFav,
    setIsFav,
  ]);

  return (
    <div className='output' ref={outputRef} onClick={outputClicked}>
      <div className='sect1'>
        <div className='sect1Left'>
          {/* add to favs  */}
          <div className='addToFavsDiv' ref={favWrap}>
            <span onClick={addToFavs}>
              {isFav ? (
                <>
                  <span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      // width='36'
                      // height='34'
                      viewBox='0 0 36 34'
                      fill='none'
                    >
                      <path
                        d='M23.7419 10.0969L20.2344 3.10801C19.3119 1.26985 16.6881 1.26986 15.7656 3.10801L12.2581 10.0969L4.52734 11.2731C2.49406 11.5824 1.6833 14.0778 3.14641 15.5232L8.70935 21.0187L7.43905 28.7345C7.10494 30.7639 9.2276 32.3061 11.0544 31.3612L18 27.7688L24.9456 31.3612C26.7724 32.3061 28.8951 30.7639 28.561 28.7345L27.2906 21.0187L32.8536 15.5232C34.3167 14.0778 33.5059 11.5824 31.4727 11.2731L23.7419 10.0969Z'
                        strokeWidth='3'
                        fill='white'
                      />
                    </svg>
                  </span>
                  <span>in favorites</span>
                </>
              ) : (
                <>
                  <span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      // width='36'
                      // height='34'
                      viewBox='0 0 36 34'
                      fill='none'
                    >
                      <path
                        d='M23.7419 10.0969L20.2344 3.10801C19.3119 1.26985 16.6881 1.26986 15.7656 3.10801L12.2581 10.0969L4.52734 11.2731C2.49406 11.5824 1.6833 14.0778 3.14641 15.5232L8.70935 21.0187L7.43905 28.7345C7.10494 30.7639 9.2276 32.3061 11.0544 31.3612L18 27.7688L24.9456 31.3612C26.7724 32.3061 28.8951 30.7639 28.561 28.7345L27.2906 21.0187L32.8536 15.5232C34.3167 14.0778 33.5059 11.5824 31.4727 11.2731L23.7419 10.0969Z'
                        strokeWidth='3'
                      />
                    </svg>
                  </span>
                  <span>add to favorites</span>
                </>
              )}
            </span>
          </div>
          {/* main temp  */}
          <div className='mainTempWrap' ref={tempDivWidth}>
            <span className='temp'>
              {Math.floor(weather[deg].current.temp)}
            </span>
            <span className='deg'>{tempUnit ? "F˚" : "C˚"}</span>
          </div>
          {/* location data  */}
          <div className='locationDataWrap' ref={locDatWrap}>
            <div className='loc1'>{selectTown.name}</div>
            <div className='loc2'>{selectTown.state}</div>
            <div className='countrySect'>
              <div className='flag'>
                <img alt={countryName} src={countryFlag} />
              </div>
              <div className='loc3'>{countryName}</div>
            </div>
          </div>
        </div>
        <div className='sect1Right'>
          {/* CURRENT CONDITIONS, TEMP */}
          {currentDate && (
            <div className='currentDate'>
              as of
              <span>{currentDate},</span>
              <span>|</span>
              <span>{selectTown.name} local time</span>
            </div>
          )}

          <div className='currentSect1'>
            <div className='currentIcon'>
              <Svg weather={weather[deg].current.weather[0].main} />
            </div>
            <div className='currentDesc'>
              <span>
                {/*  display all conditions */}
                {weather[deg].current.weather.map((e, index) => {
                  if (weather[deg].current.weather.length - 1 === index) {
                    return e.description;
                  } else {
                    return `${e.description}, `;
                  }
                })}
              </span>
              <div className='currentDesc2'>
                <div className='feelsLike'>
                  {Math.floor(weather[deg].current.feels_like)}˚
                </div>
                <div className='currentHumidity'>
                  <span>
                    {weather[deg].current.humidity}
                    <sup>%</sup>
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* SUNRISE & SUNSET */}
          <div className='currentSect2'>
            <div className='lightBar'>
              <div className='dayHoursDesc'>
                <span>{lightHours}&nbsp;</span>
                <span>hours of daylight</span>
              </div>
              <div className='lightBarWrap'>
                <div className='bar' ref={lightBar}>
                  <div className='rise'></div>
                  <div className='set'></div>
                </div>
              </div>
              <div className='timeSectRiseSet'>
                <div className='riseSect'>
                  <div className='rise'></div>
                  <div className='riseTime'>{riseSet && riseSet[0]}</div>
                </div>
                <div className='setSect'>
                  <div className='set'></div>
                  <div className='setTime'>{riseSet && riseSet[1]}</div>
                </div>
              </div>
            </div>
          </div>
          {/* HOURLY SECT  */}
          <div className='currentSect3'>
            <div className='hourlySect'>
              {hourlyArr &&
                hourlyArr.map((e, index) => {
                  return (
                    <Hourly
                      key={index}
                      num={index}
                      data={e}
                      calculateLocalTime={calculateLocalTime}
                      formatTimeInTimeZone={formatTimeInTimeZone}
                      weather={weather}
                      deg={deg}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      {/* SECT 2 */}
      <Sect2 weather={weather} deg={deg} />
    </div>
  );
};
