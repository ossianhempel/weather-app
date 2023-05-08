// Ossian Hempel

// API Key generated from Weather API: https://www.weatherapi.com/
const apiKey = 'c9743f30e57d4c16b27210100230105';

// const locationQuery = 'Stockholm';


// TODO Reference The Odin Project
const getCurrentWeatherData = (locationQuery) => {
  /**
   * Documentation
   * 
   * 
   */

  // URL for accessing the API
  const endpoint = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${locationQuery}`;
  
  
  // Make API call that returns a promise created by fetch
  return fetch(endpoint, {mode: 'cors'})
  .then(response => {
    return response.json();
  })
  // Assigning parsed data points of interest to variables
  .then(data => {
    const condition = data.current.condition.text;
    const iconUrl = data.current.condition.icon;
    const currentTemp = data.current.temp_c;
    const feelsLikeC = data.current.feelslike_c;
    const humidity = data.current.humidity;
    const chanceOfRain = data.current.chance_of_rain;
    const windKph = data.current.wind_kph;

    // Return an object containing the extracted data
    return {
      condition: condition,
      iconUrl: iconUrl,
      currentTemp: currentTemp,
      feelsLike: feelsLikeC,
      humidity: humidity,
      chanceOfRain: chanceOfRain,
      wind: windKph,
    };
  })
  // TODO
  .catch(function(error) {
    // reject(Error(`There is no data for ${locationQuery}`));
    console.error(`Error: ${error}`);
  });
}

const cleanWeatherData = (data) => {
  /**
   * 
   * 
   * 
   */
  return dataObject;
}


getCurrentWeatherData('Stockholm')
  .then(function(data) {
    const condition = data.condition;
    const iconUrl = data.iconUrl;
    const currentTemp = data.currentTemp;
    const feelsLike = data.feelsLike;
    const humidity = data.humidity;
    const chanceOfRain = data.chanceOfRain;
    const wind = data.wind;
    
    // Do something with the extracted data here...
    console.log(`
      Condition: ${condition}, 
      IconUrl: ${iconUrl}, 
      Current temperature: ${currentTemp};
      Feels like: ${feelsLike}, 
      Humidity: ${humidity}, 
      Wind: ${wind}
      `);
  })
  .catch(function(error) {
    console.error(`Error: ${error}`);
  });
