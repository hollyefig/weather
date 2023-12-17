import React from "react";
import "./sect2.css";
import { Svg } from "../SVG/Svg";

export const Sect2 = ({ weather, months, daysOfWeek }) => {
  // ! get local day
  const getLocal = (timeStamp, timezoneOffset) => {
    // Convert UTC timestamp to milliseconds
    const utcMilliseconds = timeStamp * 1000;

    // Apply the timezone offset
    const localMilliseconds = utcMilliseconds + timezoneOffset * 1000;

    // Create a new Date object with the local time
    const localDate = new Date(localMilliseconds);

    // Return a Date object with local time
    return localDate;
  };

  let weekArr = [];
  for (let i = 0; i < weather.daily.length; i++) {
    weekArr.push(weather.daily[i]);
  }

  return (
    <div className='sect2'>
      <div className='dailySet'>
        {weekArr &&
          weekArr.map((e, index) => {
            let day =
              daysOfWeek[getLocal(e.dt, weather.timezone_offset).getDay()];
            let month =
              months[getLocal(e.dt, weather.timezone_offset).getMonth()];
            let dayNum = getLocal(e.dt, weather.timezone_offset).getDate();

            return (
              index !== 0 && (
                <div id={`daily${index}`} key={index}>
                  <div className='dailyMonthDayNum'>
                    <div className='dailyMonth'>
                      {month.substring(0, 3)}&nbsp;
                    </div>
                    <div className='dailyDayNum'>{dayNum}</div>
                    <div className='dailyDay'>{day.substring(0, 3)}</div>
                  </div>
                  <div className='dailyIcon'>
                    <Svg weather={e.weather[0].main} />
                  </div>
                  <div className='dailyTemp'>{Math.floor(e.temp.day)}˚</div>
                  <div className='dailyDesc'>{e.weather[0].main}</div>
                  <div className='dailyHighLow'>
                    <div className='high'>{Math.floor(e.temp.max)}˚</div>
                    <div className='low'>{Math.floor(e.temp.min)}˚</div>
                  </div>
                </div>
              )
            );
          })}
      </div>
    </div>
  );
};
