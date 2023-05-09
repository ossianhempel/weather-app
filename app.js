// Ossian Hempel

// API Key generated from Weather API: https://www.weatherapi.com/
const apiKey = 'c9743f30e57d4c16b27210100230105';


// ---------- Declaring functions ----------

// TODO Reference The Odin Project
// TODO Function for..
function getCurrentWeatherData(locationQuery) {
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
      
      // Check if the response contains an error message
      if (data.error) {
        throw new Error(data.error.message);
      }

      const condition = data.current.condition.text;
      const iconUrl = data.current.condition.icon;
      const currentTemp = data.current.temp_c;
      const feelsLikeC = data.current.feelslike_c;
      const humidity = data.current.humidity;
      // const chanceOfRain = data.current.chance_of_rain; Only exists for forecast
      const windKph = data.current.wind_kph;

      // Return an object containing the extracted data
      return {
        condition: condition,
        iconUrl: iconUrl,
        currentTemp: currentTemp,
        feelsLike: feelsLikeC,
        humidity: humidity,
        wind: windKph,
      };
    })
}


// TODO Function ...
function getDailyForecastData(locationQuery) {

  /**
   * Documentation
   * 
   * 
   */

  // URL for accessing the API
  const endpoint = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${locationQuery}&days=7`;

  // Make API call that returns a promise created by fetch
  return fetch(endpoint, { mode: 'cors' })
    .then(response => {
      return response.json();
    })
    .then(data => {
      
      // Check if the response contains an error message
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      const forecastData = [];

      // Loop through the forecast days and extract the relevant data
      for (let i = 0; i < data.forecast.forecastday.length; i++) {
        const forecastDay = data.forecast.forecastday[i];
        const date = forecastDay.date;
        const maxTemp = forecastDay.day.maxtemp_c;
        const minTemp = forecastDay.day.mintemp_c;
        const condition = forecastDay.day.condition.text;
        const iconUrl = forecastDay.day.condition.icon;

        forecastData.push({
          date: date,
          maxTemp: maxTemp,
          minTemp: minTemp,
          condition: condition,
          iconUrl: iconUrl,
        });
      }

      return forecastData;
    })
};

// TODO Function ...
function getHourlyForecastData(locationQuery) {
  /**
   * Documentation
   * 
   * 
   */

  // URL for accessing the API with hourly forecast
  const endpoint = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${locationQuery}&days=1&hourly=24`;

  // Make API call that returns a promise created by fetch
  return fetch(endpoint, { mode: 'cors' })
  .then(response => {
    return response.json();
  })
  .then(data => {

    // Check if the response contains an error message
    if (data.error) {
      throw new Error(data.error.message);
    }

    const hourlyForecastData = [];

    // Loop through the hourly forecast data and extract the relevant information
    for (let i = 0; i < data.forecast.forecastday[0].hour.length; i++) {
      const hourlyData = data.forecast.forecastday[0].hour[i];
      const hour = hourlyData.time; 
      const temperature = hourlyData.temp_c; 
      const condition = hourlyData.condition.text;
      const iconUrl = hourlyData.condition.icon;

      hourlyForecastData.push({
        hour: hour,
        temperature: temperature, 
        condition: condition,
        iconUrl: iconUrl,
      });
    }

    return hourlyForecastData;
  })
};


// Call the data-collection functions for a query
const getAllData = (locationQuery) => {
  // TODO Calling...
  getCurrentWeatherData(locationQuery)
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
    .catch(function (error) {
      console.error(`Error: ${error}`);
  });


  // TODO Calling...
  getDailyForecastData(locationQuery)
  .then(function(data) {
  data.forEach(forecast => {
    const date = forecast.date;
    const condition = forecast.condition;
    const maxTemp = forecast.maxTemp;
    const minTemp = forecast.minTemp;

    // Do something with the extracted data here...
    console.log(`Date: ${date}, Condition: ${condition}, Max temperature: ${maxTemp}, Min temperature: ${minTemp}`);
    });
  })
  .catch(function (error) {
    console.error(`Error: ${error}`);
  });

  // TODO Calling...
  getHourlyForecastData(locationQuery)
  .then(function(data) {
    data.forEach(hourly => {
      const hour = hourly.hour; // Use 'hour' instead of 'time'
      const condition = hourly.condition;
      const temperature = hourly.temperature;

      // Do something with the extracted data here...
      console.log(`Time: ${hour}, Condition: ${condition}, Temperature: ${temperature}`);
    });
  })
  .catch(function (error) {
    console.error(`Error: ${error}`);
  });
};


// Function for performing the search
const searchWeather = (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the form element and the location input value
  const locationInput = form.querySelector('#location');
  const locationQuery = locationInput.value;

  // Call the getAllData function with the locationQuery
  console.log(locationQuery);
  getAllData(locationQuery);
};





// ---------- Execution ----------


// Add an event listener for the form submit event
const form = document.querySelector('#weather-form');
form.addEventListener('submit', searchWeather);

// getAllData('Stockholm')