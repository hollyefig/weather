import { useState } from "react";
import { getCountryName } from "../../APIcalls";

export const Output = ({ selectTown, weather }) => {
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
          <h4>Country:</h4>
          {countryName}
          <p>
            <img alt={countryName} src={countryFlag} width='15' />
          </p>
          <h4>Town:</h4>
          {selectTown.name}
          <h4>Region/State:</h4>
          {selectTown.state}
          <h4>Current Temp:</h4>
          {`${Math.floor(weather.current.temp)} ˚F`}
          <h4>Feels Like:</h4>
          {`${Math.floor(weather.current.feels_like)} ˚F`}
        </>
      )}
    </div>
  );
};
