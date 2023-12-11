import { useState } from "react";
import { getCountryName } from "../../APIcalls";
import "./output.css";

export const Output = ({ selectTown, weather, deg }) => {
  const [countryName, setCountryName] = useState(null);
  const [countryFlag, setCountryFlag] = useState("");

  // ! get country name
  const toCountryName = async () => {
    let countryCode = selectTown.country;
    let loadName = await getCountryName(countryCode);

    setCountryName(loadName[0].name.common);
    setCountryFlag(loadName[0].flags.svg);
  };

  if (weather) {
    // console.log("logging", weather);
    toCountryName();
  }
  return (
    <div className='output'>
      {selectTown && weather && (
        <>
          {/* 
          <h4>Feels Like:</h4>
          {`${Math.floor(weather.current.feels_like)} ˚F`} */}
          <div className='sect1'>
            <div className='sect1Left'>
              <div className='mainTempWrap'>
                <span className='temp'>{Math.floor(weather.current.temp)}</span>
                <span className='deg'>{deg}</span>
              </div>
              <div className='locationDataWrap'>
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
            <div className='sect1Right'>right</div>
          </div>
        </>
      )}
    </div>
  );
};
