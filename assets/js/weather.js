const apiKey = '48eeec04e0b7fbab7f60aee652513ccc';
const city = 'Dallas'; // Example city

const apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
const apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

fetch(apiUrlCurrent)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the JSON data
    console.log(data);
    // Here you can work with the data returned from the API
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

fetch(apiUrlForecast)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the JSON data
    console.log(data);
    // Here you can work with the data returned from the API
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });



  