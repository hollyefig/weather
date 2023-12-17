import React from "react";
import { Svg } from "../SVG/Svg";

export const Hourly = ({
  num,
  data,
  calculateLocalTime,
  formatTimeInTimeZone,
  weather,
}) => {
  // ? set hour
  let hour = formatTimeInTimeZone(
    calculateLocalTime([data.dt], weather.timezone_offset),
    "GMT"
  );
  hour = JSON.stringify(hour)
    .replace(":00 ", "")
    .replace(`["`, "")
    .replace(`"]`, "");

  return (
    <div className={`hourly${num}`}>
      <div className='hourlyIcon'>
        <Svg weather={data.weather[0].main} />
      </div>
      <div className='hourlyTemp'>{Math.floor(data.temp)}˚</div>
      <div className='hourlyHour'>{hour}</div>
    </div>
  );
};
