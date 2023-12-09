export const Output = ({ selectTown, weather }) => {
  weather !== null && console.log("logging", weather.current);

  return (
    <div>
      <h4>Country:</h4>
      {selectTown !== "" && selectTown[0].country}
      <h4>Town:</h4>
      {selectTown !== "" && selectTown[0].name}
      <h4>Region/State:</h4>
      {selectTown !== "" && selectTown[0].state}
      <h4>Current Temp:</h4>
      {weather !== null && `${weather.current.temp} ˚F`}
    </div>
  );
};
