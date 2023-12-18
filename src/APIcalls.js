import axios from "axios";

// default id
// dd6822690631c05678dc46c5647a00a5

// backup
// e705fd2733337e25a8b91977646312e1

export const getTown = async (town) => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${town}&appid=dd6822690631c05678dc46c5647a00a5`
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
      `https://api.openweathermap.org/geo/1.0/zip?zip=${zip}&appid=dd6822690631c05678dc46c5647a00a5`
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

export const getWeather = async (lat, lon) => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?units=imperial&lat=${lat}&lon=${lon}&appid=dd6822690631c05678dc46c5647a00a5`
    );
    return res.data;
  } catch (error) {
    console.error("error fetching weather", error);
  }
};
