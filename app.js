// Ossian Hempel

// Declaring element variables
const locationDiv = document.querySelector('.location');
const conditionDiv = document.querySelector('.current-condition');
const currentWeatherIconImg = document.querySelector('.current-weather-icon');
const temperatureDiv = document.querySelector('.current-temperature');
const localTimeDiv = document.querySelector('.current-time');
const feelsLikeDiv = document.querySelector('.current-feels-like');
const humidityDiv = document.querySelector('.current-humidity');
const windDiv = document.querySelector('.current-wind');
const forecastContainer = document.querySelector(".forecast-container");
const forecastBtnContainer = document.querySelector('.daily-hourly-btn-container');
const searchErrorMessage = document.querySelector('.search-error-message');

// Create button to toggle between hourly forecast data
const toggleHourlyForecastBtn = document.createElement('button');
toggleHourlyForecastBtn.classList.add('toggle-hourly-forecast-btn');

// Declare a variable to keep track of which hourly forecasted data set is currently displayed
let currentDataSetIndex = 0;


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
      const iconUrl = "https:" + data.current.condition.icon;
      const country = data.location.country;
      const city = data.location.name;
      const currentTemp = data.current.temp_c;
      const localTime = data.location.localtime;
      const feelsLikeC = data.current.feelslike_c;
      const humidity = data.current.humidity;
      const windKph = data.current.wind_kph;

      // Return an object containing the extracted data
      return {
        condition: condition,
        country: country,
        city: city,
        iconUrl: iconUrl,
        currentTemp: currentTemp,
        localTime: localTime,
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
  // (Can only get 3 days worth of forecasting on the free API tier)
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
        const iconUrl = "https:" + forecastDay.day.condition.icon;

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
      const date = hourlyData.time; 
      const hour = date.split(" ")[1]; // Extract just the hour
      const temperature = hourlyData.temp_c; 
      const condition = hourlyData.condition.text;
      const iconUrl = "https:" + hourlyData.condition.icon;

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
    const country = currentWeatherData.country;
    const city = currentWeatherData.city;
    const currentTemp = currentWeatherData.currentTemp;
    const localTime = currentWeatherData.localTime;
    const feelsLike = currentWeatherData.feelsLike;
    const humidity = currentWeatherData.humidity;
    const wind = currentWeatherData.wind;
    const iconUrl = currentWeatherData.iconUrl;

    currentWeatherIconImg.classList.add('current-icon');
    
    // Display current weather data in the DOM
    locationDiv.textContent = `${city}, ${country}`;
    conditionDiv.textContent = `${condition}`;
    temperatureDiv.textContent = `${currentTemp}°C`;
    // localTimeDiv.textContent = `${localTime}`;
    localTimeDiv.textContent = formatLocalTime(localTime);
    feelsLikeDiv.textContent = `Feels like: ${feelsLike}°C`;
    humidityDiv.textContent = `Humidity: ${humidity}%`;
    windDiv.textContent = `Wind: ${wind} km/h`;
    currentWeatherIconImg.src = iconUrl;

    
    // Get daily forecast data
    const dailyForecastData = await getDailyForecastData(locationQuery);
    dailyForecastData.forEach(daily => {
      const date = daily.date;
      const condition = daily.condition;
      const maxTemp = daily.maxTemp;
      const minTemp = daily.minTemp;
      const iconUrl = daily.iconUrl;
      
    });

    // Get hourly forecast data
    const hourlyForecastData = await getHourlyForecastData(locationQuery);
    hourlyForecastData.forEach(hourly => {
      const hour = hourly.hour; 
      const condition = hourly.condition;
      const temperature = hourly.temperature;
      const iconUrl = hourly.iconUrl;
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
  let forecastDiv = document.createElement("div");
  forecastDiv.classList.add('forecast-element');

  // Create sub-divs for the different weather attributes
  // Daily forecast
  let dailyForecastDateDiv = document.createElement('div');
  let dailyForecastConditionDiv = document.createElement('div');
  let dailyForecastMaxTemperatureDiv = document.createElement('div');
  let dailyForecastMinTemperatureDiv = document.createElement('div');
  let dailyForecastIconImg = document.createElement('img');
  dailyForecastDateDiv.classList.add('daily-forecast-date');
  dailyForecastConditionDiv.classList.add('daily-forecast-condition');
  dailyForecastMaxTemperatureDiv.classList.add('daily-forecast-max-temperature');
  dailyForecastMinTemperatureDiv.classList.add('daily-forecast-min-temperature');
  dailyForecastIconImg.classList.add('daily-forecast-icon');
  
  // Hourly forecast
  let hourlyForecastTimeDiv = document.createElement('div');
  let hourlyForecastConditionDiv = document.createElement('div');
  let hourlyForecastTemperatureDiv = document.createElement('div');
  let hourlyForecastIconImg = document.createElement('img');
  hourlyForecastTimeDiv.classList.add('hourly-forecast-time');
  hourlyForecastConditionDiv.classList.add('hourly-forecast-condition');
  hourlyForecastTemperatureDiv.classList.add('hourly-forecast-temperature');
  hourlyForecastIconImg.classList.add('hourly-forecast-icon');

  // Add content to the div
  if (isHourly) {
    forecastDiv.appendChild(hourlyForecastTimeDiv);
    forecastDiv.appendChild(hourlyForecastConditionDiv);
    forecastDiv.appendChild(hourlyForecastTemperatureDiv);
    forecastDiv.appendChild(hourlyForecastIconImg);
    hourlyForecastTimeDiv.textContent = `${forecast.hour}`;
    hourlyForecastTemperatureDiv.textContent = `${forecast.temperature}°C`;
    hourlyForecastConditionDiv.textContent = `${forecast.condition}`;
    hourlyForecastIconImg.src = forecast.iconUrl;

  } else {
    forecastDiv.appendChild(dailyForecastDateDiv);
    forecastDiv.appendChild(dailyForecastConditionDiv);
    forecastDiv.appendChild(dailyForecastMaxTemperatureDiv);
    forecastDiv.appendChild(dailyForecastMinTemperatureDiv);
    forecastDiv.appendChild(dailyForecastIconImg);
    dailyForecastDateDiv.textContent = `${forecast.date}`;
    dailyForecastMaxTemperatureDiv.textContent = `${forecast.maxTemp}°C`;
    dailyForecastMinTemperatureDiv.textContent = `${forecast.minTemp}°C`;
    dailyForecastConditionDiv.textContent = `${forecast.condition}`;
    dailyForecastIconImg.src = forecast.iconUrl;
  }

  // Return the new div element
  return forecastDiv;
}

// Create two buttons for toggling the data
const toggleNextBtn = document.createElement('button');
toggleNextBtn.textContent = 'Next';

// Add class to buttons for styling
toggleNextBtn.classList.add('toggle-button');

// Function that takes a list of forecasted data and creates a new div for each item in the list
function displayForecast(forecastData, isHourly) {

  // Clear the forecast container
  forecastContainer.innerHTML = '';

  // If the forecast is hourly, display hourly forecast
  if (isHourly) {
    // Split the forecast data into three parts
    let forecastData1 = forecastData.slice(0, 8);
    let forecastData2 = forecastData.slice(8, 16);
    let forecastData3 = forecastData.slice(16, 24);

    // Store all data sets in an array
    let dataSets = [forecastData1, forecastData2, forecastData3];

    // Append the button to toggle between hourly forecast data
    if(!forecastBtnContainer.contains(toggleNextBtn)) {
      forecastBtnContainer.appendChild(toggleNextBtn);
    }

    // Add a new div for each forecast
    let dataToDisplay = dataSets[currentDataSetIndex];

    dataToDisplay.forEach(forecast => {
      forecastContainer.appendChild(createForecastElement(forecast, isHourly));
    });

    // Set up the click event handler for the next button
    toggleNextBtn.onclick = function() {
      // Increment the index of the current data set
      currentDataSetIndex = (currentDataSetIndex + 1) % dataSets.length;
      
      // Call displayForecast again to update the display
      displayForecast(forecastData, isHourly);
    }

    // If the forecast is not hourly (but daily)
  } else {
    // Add a new div for each forecast
    forecastData.forEach(forecast => {
      forecastContainer.appendChild(createForecastElement(forecast, isHourly));
    });

    // Remove the button for toggling between hourly forecast data
    if(forecastBtnContainer.contains(toggleNextBtn)) {
      forecastBtnContainer.removeChild(toggleNextBtn);
    }
  }
}

// Function for performing the search
const searchWeather = (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the form element and the location input value
  const locationInput = form.querySelector('#search-location');
  const locationQuery = locationInput.value;

  // Call the getAllData function with the locationQuery
  // When calling getAllData, store the returned data in the allData variable
  getAllData(locationQuery)
    .then(data => {
      // Hide error message on successful query
      searchErrorMessage.style.display = 'none';
      allData = data;
      // Display the daily forecast immediately after the data has been fetched
      displayForecast(allData.dailyForecastData, false);
    })
    .catch(error => {
      // Display error message on unsuccessful query
      console.error(`Failed to fetch weather data: ${error}`);
      searchErrorMessage.style.display = 'block';
    });
};

// Function inspired by: https://taimoorsattar.com/blogs/javascript-date-format
// Converts a date string from "yyyy-mm-dd hh:mm" format to "Day, dd Month 'yy h:mm a" format.
function formatLocalTime(dateString) {
  // Create a Date object from the string
  const date = new Date(dateString);

  // Array of day names
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Array of month names
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Get the day name
  const day = days[date.getUTCDay()];

  // Get the date number
  const dateNumber = date.getUTCDate();

  // Get the month name
  const month = months[date.getUTCMonth()];

  // Get the year, and convert it to a 2-digit string
  const year = String(date.getUTCFullYear()).slice(-2);

  // Get the hours and convert it to 12-hour format
  let hours = date.getUTCHours();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = (hours % 12) + 2; // It's 2 hours behind for some reason
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Get the minutes and convert it to a 2-digit string
  const minutes = ('0' + date.getUTCMinutes()).slice(-2);

  // Return the formatted string
  return `${day}, ${dateNumber} ${month} '${year} ${hours}:${minutes} ${ampm}`;
}



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