
function searchCityWeather(cityName) {

    const apiKey = '48eeec04e0b7fbab7f60aee652513ccc';
    const apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    const apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;


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
        displayCurrentWeather(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        $('#errorMessage').removeClass('d-none');
        setTimeout(function() {
            // Hide the error message after 1.5 seconds
            $('#errorMessage').addClass('d-none');
        }, 1500);
    });
    
    fetch(apiUrlForecast)
    .then(response => {
        if (!response.ok) {
            displayError();
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Process the JSON data
        console.log(data);
        // Here you can work with the data returned from the API
        displayForecastWeather(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function savePreviousSearch(cityName) {
    let searchHistory = getSearchHistory();

    searchHistory = $.merge([cityName], searchHistory.slice(0, 98));
    searchHistory = [...new Set(searchHistory)];

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory)); 
}

function getSearchHistory() {
    return JSON.parse(localStorage.getItem('searchHistory')) || [];
}

function displayCurrentWeather(data) {
    console.log('Todays weather!!!');

    const cityName = data.name;
    const cityCountry = data.sys.country;
    const cityTemp = kelvinToFahrenheit(data.main.temp);
    const cityTempFeels = kelvinToFahrenheit(data.main.feels_like);
    const cityTempMax = kelvinToFahrenheit(data.main.temp_max);
    const cityTempMin = kelvinToFahrenheit(data.main.temp_min);
    const cityHumidity = data.main.humidity;
    const cityWindSpeed = parseInt(data.wind.speed * 2.23694);
    const cityWeatherDescription = capitalizeFirstLetter(data.weather[0].description);
    const mainWeatherDescription = capitalizeFirstLetter(data.weather[0].main);

    // Define a mapping of weather descriptions to background colors
    const backgroundMap = {
        'Clear': './assets/images/sunny.gif', // Sunny
        'Clouds': './assets/images/cloudy2.gif', // Cloudy
        'Rain': './assets/images/rainy.gif', // Rainy
        'Thunderstorm': '#575757', // Thunderstorm
        'Snow': '#F6F6F6', // Snowy
        // Add more mappings as needed
    };

    // Get the background color based on the weather description
    const backgroundImageUrl = backgroundMap[mainWeatherDescription] || '#FFFFFF'; // Default to white if no match found

    const displayWeather = $('#display-weather')

    displayWeather.css({
        'background-image': 'url("' + backgroundImageUrl + '")',
        'background-size': '100% auto',
        'background-position': 'center',
        'background-repeat': 'no-repeat',
    });
    
    // Create a jQuery object for the card
    let $card = $('<div class="card cityWeather">')

    // Create a card body
    let $cardBody = $('<div class="insideCityWeather">');

    // Set the card content
    $cardBody.append(
        $('<h5>').addClass('card-title text-center fw-bold fs-14').text(cityName+', ' +cityCountry),
        $('<p>').addClass('card-text text-left').text('Temperature: ' + cityTemp + '°F'),
        $('<p>').addClass('card-text').text('Feels Like: ' + cityTempFeels + '°F'),
        $('<p>').addClass('card-text').text('Max Temperature: ' + cityTempMax + '°F'),
        $('<p>').addClass('card-text').text('Min Temperature: ' + cityTempMin + '°F'),
        $('<p>').addClass('card-text').text('Humidity: ' + cityHumidity + '%'),
        $('<p>').addClass('card-text').text('Wind Speed: ' + cityWindSpeed + ' mph'),
        $('<p>').addClass('card-text').text('Description: ' + cityWeatherDescription)
    );

    // Append the card body to the card
    $card.append($cardBody);

    // Append the card to the display-weather container
    $('#display-weather').append($card);

    // console.log(cityName, cityTemp, cityTempFeels, cityTempMax, cityTempMin, cityHumidity, cityWindSpeed, cityWeather);
    

}

function displayForecastWeather(data) {
    const forecasts = data.list;
    const forecastContainer = $('#forecast');

    // Clear any existing content in the forecast container
    forecastContainer.empty();

    // Loop through each forecast data item
    for (let i = 0; i < forecasts.length; i += 8) {
        const forecast = forecasts[i];
        const date = dayjs(forecast.dt_txt);
        const formattedDate = date.format('dddd - MM/DD/YYYY');
        const temperature = kelvinToFahrenheit(forecast.main.temp);
        const feelsLike = kelvinToFahrenheit(forecast.main.feels_like);
        const tempMin = kelvinToFahrenheit(forecast.main.temp_min);
        const tempMax = kelvinToFahrenheit(forecast.main.temp_max);
        const windSpeed = parseInt(forecast.wind.speed * 2.23694);
        const weatherDescription = capitalizeFirstLetter(forecast.weather[0].description);

        // Create a card for the forecast
        const card = $('<div>').addClass('card eachForecast');
        const cardBody = $('<div>').addClass('forecastWeather');

        // Populate card body with forecast details
        const dateElement = $('<p>').addClass('dateElement text-center fw-bold fs-14').text(formattedDate);
        const temperatureElement = $('<p>').text(`Temperature: ${temperature} °F`);
        const feelsLikeElement = $('<p>').text(`Feels Like: ${feelsLike} °F`);
        const tempMinMaxElement = $('<p>').text(`Min: ${tempMin} °F, Max: ${tempMax} °F`);
        const windSpeedElement = $('<p>').text(`Wind Speed: ${windSpeed} mph`);
        const descriptionElement = $('<p>').text(`Description: ${weatherDescription}`);

        // Append forecast details to card body
        cardBody.append(dateElement, temperatureElement, feelsLikeElement, tempMinMaxElement, windSpeedElement, descriptionElement);

        // Append card body to card
        card.append(cardBody);

        // Append card to forecast container
        forecastContainer.append(card);
    }
}

function displayError() {
    $('#errorMessage').css('opacity', 1);
    setTimeout(function() {
        // Hide the error message after 3 seconds
        $('#errorMessage').css('opacity', 0);
    }, 1500);
}

function kelvinToFahrenheit(kelvin) {
    return parseInt((kelvin - 273.15) * 9/5 + 32);
}

function capitalizeFirstLetter(string) {
    return string.replace(/\b\w/g, function(char) {
        return char.toUpperCase();
    });
}

$('#citySearchForm').submit(function(event) {
    event.preventDefault();
    const citySearchInput = $('#citySearchInput');
    
    let inputValue = citySearchInput.val(); // Get the current value of the input
    inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1); // Capitalize the first letter

    citySearchInput.val(inputValue); // Set the capitalized value back to the input field
    

    if (inputValue.length>3) {
        window.location.href = `search-weather.html?search=${inputValue}`;

    } else {
        displayError();
    }

});
// $('#citySearchInput').autocomplete({
//     source: function(request, response) {
//         console.log(request.term);
//         if (request.term.length < 3) return;
//         // Fetch city data from the OpenWeatherMap API
//         $.get({
//             url: 'https://api.openweathermap.org/data/2.5/find',
//             data: {
//                 q: request.term, // Search query
//                 appid: '48eeec04e0b7fbab7f60aee652513ccc', // Your API key
//                 type: 'like', // Match city name partially
//                 mode: 'json', // JSON response
//                 cnt: 10 // Number of results to return
//             },
//             success: function(data) {
//                 // Extract unique city names with state and country from the API response
//                 const uniqueCities = {};
//                 const cityInfo = [];
//                 data.list.forEach(city => {
//                     const cityName = `${city.name}, ${city.sys.country}`;
//                     // Add city name to the uniqueCities object
//                     uniqueCities[cityName] = true;
//                 });
//                 // Push unique city names to the cityInfo array
//                 Object.keys(uniqueCities).forEach(cityName => {
//                     cityInfo.push(cityName);
//                 });
//                 // Provide the unique city names as suggestions
//                 response(cityInfo);
//             },
//             error: function(error) {
//                 console.error('Error fetching city data:', error);
//                 response([]); // Return an empty array in case of error
//             }
//         });
//     },
//     minLength: 3 // Minimum number of characters before autocomplete starts
// });

$('#citySearchInput').click(function(){
    
    if ($('#search-history-container').attr('data-processed') === 'false') {
        getSearchHistory().splice(0, 4).forEach(search => {
            let $card = $('<div class="border">' +
            '<div class="recent-search">' +
            '<a href="/search-weather.html?search='+ search +'">'+ search +'</a>' +
            '</div>' +
            '</div>');
            // Append the card to the parent container
            $('#search-history-container').append($card);
        });
        $('#search-history-container').attr('data-processed', 'true');
    }
    $('#search-history-container').removeClass('d-none');
    
})

$('#citySearchInput').blur(function(){
    // TODO: Redirecting did not work when clicked, setTimeout gives us enough time before blur.
    setTimeout(function(){
      $('#search-history-container').addClass('d-none');  
    }, 150)
}) 

$(document).ready(function () {
    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Get the value of a specific parameter
    const cityNameSearch = urlParams.get('search');

    if (cityNameSearch) {
        console.log('City name:', cityNameSearch);
        searchCityWeather(cityNameSearch);
        savePreviousSearch(cityNameSearch);
    }
});

  