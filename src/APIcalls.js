import axios from "axios";

export const getZip = async (zip) => {
  const res = await axios.get(
    `http://api.openweathermap.org/geo/1.0/zip?appid=dd6822690631c05678dc46c5647a00a5&zip=${zip}`
  );
  return res.data;
};

export const getTown = async (town) => {
  const res = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?appid=dd6822690631c05678dc46c5647a00a5&q=${town}`
  );
  return res.data;
};

export const getWeather = async (lat, lon) => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/3.0/onecall?appid=dd6822690631c05678dc46c5647a00a5&units=imperial&lat=${lat}&lon=${lon}`
  );
  return res.data;
};
