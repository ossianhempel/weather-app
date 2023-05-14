// Ossian Hempel

// Declaring element variables
const locationDiv = document.querySelector('.location');
const conditionDiv = document.querySelector('.condition');
const weatherIconImg = document.querySelector('.weatherIcon');
const temperatureDiv = document.querySelector('.temperature');
const feelsLikeDiv = document.querySelector('.feels-like');
const humidityDiv = document.querySelector('.humidity');
const windDiv = document.querySelector('.wind');
const forecastContainer = document.querySelector(".forecast-container");
const forecastBtnContainer = document.querySelector('.daily-hourly-btn-container');
const forecastHeader = document.querySelector('#forecasted-weather-header');

// Create button to toggle between hourly forecast data
const toggleHourlyForecastBtn = document.createElement('button');
toggleHourlyForecastBtn.classList.add('toggle-hourly-forecast-btn');

// Declare a variable to keep track of which hourly forecasted data set is currently displayed
let isDisplayingFirstDataSet = true;  

// ???
let allData = {};


// API Key generated from Weather API: https://www.weatherapi.com/
const apiKey = 'c9743f30e57d4c16b27210100230105';


// TODO Reference The Odin Project



// Get current weather data
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
      // Check if the fetch request was successful
      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
      }
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


// Get daily forecasted data
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
      // Check if the fetch request was successful
      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
      }
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

// Get hourly forecasted data
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
    // Check if the fetch request was successful
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
    }
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


// Call all data-collection functions for a query
async function getAllData (locationQuery="London") {
  // Error handling within the function
  try {
    // Get current weather data
    const currentWeatherData = await getCurrentWeatherData(locationQuery);
    const condition = currentWeatherData.condition;
    const currentTemp = currentWeatherData.currentTemp;
    const feelsLike = currentWeatherData.feelsLike;
    const humidity = currentWeatherData.humidity;
    const wind = currentWeatherData.wind;
    
    // Display current weather data in the DOM
    locationDiv.textContent = locationQuery;
    conditionDiv.textContent = `${condition}`;
    temperatureDiv.textContent = `${currentTemp}°C`;
    feelsLikeDiv.textContent = `Feels like: ${feelsLike}°C`;
    humidityDiv.textContent = `Humidity: ${humidity}%`;
    windDiv.textContent = `Wind: ${wind} km/h`;

    
    // Get daily forecast data
    const dailyForecastData = await getDailyForecastData(locationQuery);
    dailyForecastData.forEach(forecast => {
      const date = forecast.date;
      const condition = forecast.condition;
      const maxTemp = forecast.maxTemp;
      const minTemp = forecast.minTemp;
      
    });

    // Get hourly forecast data
    const hourlyForecastData = await getHourlyForecastData(locationQuery)
    hourlyForecastData.forEach(hourly => {
      const hour = hourly.hour; // Use 'hour' instead of 'time'
      const condition = hourly.condition;
      const temperature = hourly.temperature;
      });

    // Return the fetched data
    return {
      currentWeatherData: currentWeatherData,
      dailyForecastData: dailyForecastData,
      hourlyForecastData: hourlyForecastData,
    };
    }
    catch (error) {
      console.error(`Error: ${error}`);
    }
};

// Function that takes a list of forecasted data and creates a new div displaying it's attributes
function createForecastElement(forecast, isHourly) {
  // Create a new div element
  let newDiv = document.createElement("div");
  newDiv.classList.add('forecast-element');

  // Add content to the div
  if (isHourly) {
    newDiv.textContent = `
      Time: ${forecast.hour}, 
      Condition: ${forecast.condition}, 
      Temperature: ${forecast.temperature}
      `;
  } else {
    newDiv.textContent = `
      Date: ${forecast.date}, 
      Condition: ${forecast.condition}, 
      Max temperature: ${forecast.maxTemp}, 
      Min temperature: ${forecast.minTemp}
      `;
  }

  // Return the new div element
  return newDiv;
}

// Function that takes a list of forecasted data and creates a new div for each item in the list
function displayForecast(forecastData, isHourly) {

  // Clear the forecast container
  forecastContainer.innerHTML = '';

  // If the forecast is hourly, display hourly forecast
  if (isHourly) {
    // Get the forecast from the current hour to 7 hours ahead
    let forecastData1 = forecastData.slice(6, 16);
    let forecastData2 = forecastData.slice(16, 24);

    // Change the forecasted data's header
    forecastHeader.textContent = "Hourly forecast";

    // Append the button to toggle between hourly forecast data
    if(!forecastBtnContainer.contains(toggleHourlyForecastBtn)) {
      forecastBtnContainer.appendChild(toggleHourlyForecastBtn);
    }

    // Add a new div for each forecast
    let dataToDisplay = isDisplayingFirstDataSet ? forecastData1 : forecastData2;
    dataToDisplay.forEach(forecast => {
      forecastContainer.appendChild(createForecastElement(forecast, isHourly));
    });

    // Set up the click event handler for the button
    toggleHourlyForecastBtn.onclick = function() {
      // Swap the value of isDisplayingFirstDataSet
      isDisplayingFirstDataSet = !isDisplayingFirstDataSet;
      
      // Call displayForecast again to update the display
      displayForecast(forecastData, isHourly);
    }
  } else {

    // Change the forecasted data's header
    forecastHeader.textContent = "Daily forecast";

    // Add a new div for each forecast
    forecastData.forEach(forecast => {
      forecastContainer.appendChild(createForecastElement(forecast, isHourly));
    });

    // Remove the button for toggling between hourly forecast data
    if(forecastBtnContainer.contains(toggleHourlyForecastBtn)) {
      forecastBtnContainer.removeChild(toggleHourlyForecastBtn);
    }
  }
}

// Function for performing the search
const searchWeather = (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the form element and the location input value
  const locationInput = form.querySelector('#location');
  const locationQuery = locationInput.value;

  // Call the getAllData function with the locationQuery
  // When calling getAllData, store the returned data in the allData variable
  getAllData(locationQuery)
    .then(data => {
      allData = data;
      // Display the daily forecast immediately after the data has been fetched
      displayForecast(allData.dailyForecastData, false);
    })
    .catch(error => {
      console.error(`Failed to fetch weather data: ${error}`);
      // potentially display an error message in the UI here
    });
};



// ------------------- Execution -------------------


// Add an event listener for the form submit event
const form = document.querySelector('#weather-form');
form.addEventListener('submit', searchWeather);


// Event listener for the daily forecast button
document.querySelector("#daily-btn").addEventListener("click", () => {
  displayForecast(allData.dailyForecastData, false);
});

// Event listener for the hourly forecast button
document.querySelector("#hourly-btn").addEventListener("click", () => {
  displayForecast(allData.hourlyForecastData, true);
});

// Default data on page load
getAllData()
    .then(data => {
      allData = data;
      // Display the daily forecast immediately after the data has been fetched
      displayForecast(allData.dailyForecastData, false);
    })
    .catch(error => {
      console.error(`Failed to fetch weather data: ${error}`);
      // potentially display an error message in the UI here
    });