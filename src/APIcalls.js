import axios from "axios";

export const getTown = async (town) => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?appid=dd6822690631c05678dc46c5647a00a5&q=${town}`
    );
    return res.data;
  } catch (error) {
    console.error("error fetching town", error);
    return;
  }
};

export const getZip = async (zip) => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/geo/1.0/zip?appid=dd6822690631c05678dc46c5647a00a5&zip=${zip}`
    );
    return res.data;
  } catch (error) {
    console.error("error fetching zip", error);
    return;
  }
};

export const getCountryName = async (name) => {
  try {
    const res = await axios.get(`https://restcountries.com/v3.1/alpha/${name}`);
    return res.data;
  } catch (error) {
    console.error("error fetching country name", error);
    return;
  }
};

export const getCountryCode = async (name) => {
  try {
    const res = await axios.get(
      `https://restcountries.com/v3.1/name/${name}?fullText=true`
    );
    return res.data;
  } catch (error) {
    console.error("error fetching country name", error);
    return;
  }
};

export const getCountryList = async () => {
  try {
    const res = await axios.get("https://restcountries.com/v3.1/all");
    return res.data;
  } catch (error) {
    console.error("error fetching country name", error);
    return;
  }
};

export const getWeather = async (lat, lon) => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?appid=dd6822690631c05678dc46c5647a00a5&units=imperial&lat=${lat}&lon=${lon}`
    );
    return res.data;
  } catch (error) {
    console.error("error fetching weather", error);
  }
};
