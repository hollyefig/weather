import React from "react";
import { Svg } from "../output/SVG/Svg";

export const Fav = ({ data, index, inputTown, setInputTown, townEntered }) => {
  // ! get local time of area
  const date = new Date();
  const getTime = new Intl.DateTimeFormat("en-GB", {
    minute: "numeric",
    hour: "numeric",
    timeZone: data.weatherStuff.timezone,
  }).format(date);
  // ! get color for time of day
  const getColor = () => {
    let current = data.weatherStuff.current.dt;
    let sunrise = data.weatherStuff.current.sunrise;
    let sunset = data.weatherStuff.current.sunset;
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
    setInputTown(() => {
      let newName = data.name;
      console.log("clicked", newName);
      townEntered();
      return newName;
    });
  };

  //   console.log("fav", data);

  return (
    <div id={`fav${index}`} onClick={chooseFav}>
      <div className='nameFav' style={{ backgroundColor: getColor() }}>
        {data.name}
      </div>
      <div className='timeFav'>{getTime}</div>
      <div className='tempFav'>
        <div>{Math.floor(data.weatherStuff.current.temp)}˚</div>
      </div>
      <div className='iconFav'>
        <Svg weather={data.weatherStuff.current.weather[0].main} />
      </div>
    </div>
  );
};
