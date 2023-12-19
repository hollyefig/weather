import axios from "axios";

// default id
// dd6822690631c05678dc46c5647a00a5

// backup
// ff399bc2ce25ee4d8dc39eaeedbeff10

export const getTown = async (town) => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${town}&appid=ff399bc2ce25ee4d8dc39eaeedbeff10`
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
      `https://api.openweathermap.org/geo/1.0/zip?zip=${zip}&appid=ff399bc2ce25ee4d8dc39eaeedbeff10`
    );
    return res.data;
  } catch (error) {
    console.error("error fetching zip", error);
    window.alert("error fetching zip");
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
    console.error("error fetching country code", error);
    return;
  }
};

export const getCountryList = async () => {
  try {
    const res = await axios.get("https://restcountries.com/v3.1/all");
    return res.data;
  } catch (error) {
    console.error("error fetching country list", error);
    return;
  }
};

// units : imperial = F, metric = C
export const getWeather = async (lat, lon, units) => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?units=${units}&lat=${lat}&lon=${lon}&appid=ff399bc2ce25ee4d8dc39eaeedbeff10`
    );
    return res.data;
  } catch (error) {
    console.error("error fetching weather", error);
  }
};
