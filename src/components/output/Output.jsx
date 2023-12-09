export const Output = ({ selectTown, weather }) => {
  //   weather !== null && console.log("logging", weather);

  return (
    <>
      {selectTown !== null && weather !== null && (
        <div>
          <h4>Country:</h4>
          {selectTown[0].country}
          <h4>Town:</h4>
          {selectTown[0].name}
          <h4>Region/State:</h4>
          {selectTown[0].state}
          <h4>Current Temp:</h4>
          {`${Math.floor(weather.current.temp)} ˚F`}
          <h4>Feels Like:</h4>
          {`${Math.floor(weather.current.feels_like)} ˚F`}
        </div>
      )}
    </>
  );
};
