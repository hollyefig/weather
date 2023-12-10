import { useState } from "react";
import { getCountryName } from "../../APIcalls";

export const Output = ({ selectTown, weather }) => {
  const [countryName, setCountryName] = useState(null);

  // ! get country name
  const toCountryName = async () => {
    let countryCode = selectTown.country;
    let loadName = await getCountryName(countryCode);
    setCountryName(loadName[0].name.common);
  };

  if (weather) {
    // console.log("logging", weather);
    toCountryName();
  }
  return (
    <div>
      {selectTown && weather && (
        <>
          <h4>Country:</h4>
          {countryName}
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
