import { useState, useRef, useEffect, useCallback } from "react";
import { getCountryName } from "../../APIcalls";
import "./output.css";
import { Svg } from "./SVG/Svg";

export const Output = ({ selectTown, weather, deg }) => {
  const [countryName, setCountryName] = useState(null);
  const [countryFlag, setCountryFlag] = useState("");
  const tempDivWidth = useRef(null);
  const locDatWrap = useRef(null);
  const [lightHours, setLightHours] = useState(null);
  const lightBar = useRef(null);

  // ! get country name
  const toCountryName = async () => {
    let countryCode = selectTown.country;
    let loadName = await getCountryName(countryCode);

    setCountryName(loadName[0].name.common);
    setCountryFlag(loadName[0].flags.svg);
  };

  // ! calculate daylight hours
  const daylightHours = useCallback((e) => {
    let set = e.sunset;
    let rise = e.sunrise;
    let seconds = set - rise;
    let min = seconds / 60;
    let hours = Math.floor(min / 60);

    lightBar.current.style.width = (hours / 24) * 100 + "%";

    return hours;
  });

  if (weather) {
    // console.log("logging", weather);
    toCountryName();
  }

  // ! make location data be same width as Temp div
  useEffect(() => {
    if (selectTown && weather) {
      let computed = window.getComputedStyle(tempDivWidth.current);
      locDatWrap.current.style.width = computed.width;
      setLightHours(daylightHours(weather.current));
    }
  }, [daylightHours, setLightHours, weather, selectTown]);

  return (
    <div className='output'>
      {selectTown && weather && (
        <>
          <div className='sect1'>
            <div className='sect1Left'>
              <div className='mainTempWrap' ref={tempDivWidth}>
                <span className='temp'>{Math.floor(weather.current.temp)}</span>
                <span className='deg'>{deg}</span>
              </div>
              <div className='locationDataWrap' ref={locDatWrap}>
                <div className='loc1'>{selectTown.name}</div>
                <div className='loc2'>{selectTown.state}</div>
                <div className='countrySect'>
                  <div className='flag'>
                    <img alt={countryName} src={countryFlag} width='15' />
                  </div>
                  <div className='loc3'>{countryName}</div>
                </div>
              </div>
            </div>
            <div className='sect1Right'>
              <div className='currentSect1'>
                <div className='currentIcon'>
                  <Svg weather={weather.current.weather[0].main} />
                </div>
                <div className='currentDesc'>
                  <span>
                    {/*  display all conditions */}
                    {weather.current.weather.map((e, index) => {
                      if (weather.current.weather.length - 1 === index) {
                        return e.description;
                      } else {
                        return `${e.description}, `;
                      }
                    })}
                  </span>
                  <div className='feelsLike'>
                    {Math.floor(weather.current.feels_like)}
                  </div>
                  <div className='windChill'>
                    {Math.floor(weather.current.wind_deg)}
                  </div>
                  <div className='currentHumidity'>
                    <span>
                      {weather.current.humidity}
                      <sup>%</sup>
                    </span>
                  </div>
                </div>
              </div>
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
                </div>
                <div className='sect2Right'>right</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
