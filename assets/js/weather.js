

function handleSearchCity() {
    const cityName = $('#citySearchInput').val().trim();
    console.log(cityName);

    if (!cityName){
        // Show the error message
        $('#errorMessage').removeClass('d-none');
        setTimeout(function() {
            // Hide the error message after 3 seconds
            $('#errorMessage').addClass('d-none');
        }, 1500);
        return;
    }

    // Clear the input field
    $('#citySearchInput').val('');
    searchCityWeather(cityName);

}

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
        // displayCurrentWeather(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        $('#errorMessage').removeClass('d-none');
        setTimeout(function() {
            // Hide the error message after 3 seconds
            $('#errorMessage').addClass('d-none');
        }, 1500);
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
}


// function saveCityNames() {

// }

// function displayCurrentWeather(data) {

// }

// function displayForecastWeather(data) {

// }

$(document).ready(function () {
    $('#citySearchForm').submit(function(event) {
        event.preventDefault();
        handleSearchCity();
    });

    $('#citySearchInput').autocomplete({
        source: function(request, response) {
            // Fetch city data from the OpenWeatherMap API
            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/find',
                method: 'GET',
                data: {
                    q: request.term, // Search query
                    appid: '48eeec04e0b7fbab7f60aee652513ccc', // Your API key
                    type: 'like', // Match city name partially
                    mode: 'json', // JSON response
                    cnt: 10 // Number of results to return
                },
                success: function(data) {
                    // Extract unique city names with state and country from the API response
                    const uniqueCities = {};
                    const cityInfo = [];
                    data.list.forEach(city => {
                        const cityName = `${city.name}, ${city.sys.country}`;
                        // Add city name to the uniqueCities object
                        uniqueCities[cityName] = true;
                    });
                    // Push unique city names to the cityInfo array
                    Object.keys(uniqueCities).forEach(cityName => {
                        cityInfo.push(cityName);
                    });
                    // Provide the unique city names as suggestions
                    response(cityInfo);
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching city data:', error);
                    response([]); // Return an empty array in case of error
                }
            });
        },
        minLength: 4 // Minimum number of characters before autocomplete starts
    });
});

  