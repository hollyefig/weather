import React from "react";
import { Svg } from "../output/SVG/Svg";

export const Fav = ({ data, index, inputTown, setInputTown, townEntered }) => {
  // ! get local time of area
  //   const date = new Date();
  //   const getTime = new Intl.DateTimeFormat("en-GB", {
  //     minute: "numeric",
  //     hour: "numeric",
  //     timeZone: data.forecast.timezone,
  //   }).format(date);
  // ! get color for time of day
  const getColor = () => {
    let current = data.forecast.current.dt;
    let sunrise = data.forecast.current.sunrise;
    let sunset = data.forecast.current.sunset;
    let twoHours = 7200;

    // ? dark
    if (current <= sunrise || current >= sunset + twoHours) {
      return "#32317B";
    }
    // ? morning
    else if (current >= sunrise && current <= sunrise + twoHours) {
      return "#EA6527";
    }
    // ? daytime (default)
    else if (current >= sunrise + twoHours && current <= sunset - twoHours) {
      return "#3AB0F3";
    }
    // ? sunset
    else if (current >= sunset - twoHours && current <= sunset + twoHours) {
      return "#F33A6F";
    }
  };

  const chooseFav = () => {
    setInputTown();
    let newName = data.name;
    setInputTown(newName);
    console.log("clicked", inputTown);
    townEntered();
  };

  //   console.log("fav", data.forecast.timezone);

  return (
    <div id={`fav${index}`} onClick={chooseFav}>
      <div className='nameFav' style={{ backgroundColor: getColor() }}>
        {data.name}
      </div>
      {/* <div className='timeFav'>{getTime}</div> */}
      <div className='tempFav'>
        <div>{Math.floor(data.forecast.current.temp)}˚</div>
      </div>
      <div className='iconFav'>
        <Svg weather={data.forecast.current.weather[0].main} />
      </div>
    </div>
  );
};
