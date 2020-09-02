var citySearchForm = $('#city-search-form');
var citySearched = $('#city-searched');
var searchHistory = $('#search-history');

var city = $('#city');
var date = $('#date');
var icon = $('#weather-icon');
var temp = $('#temp');
var uvIndex = $('#uv-index');
var humidity = $('#humidity');
var windSpeed = $('#wind-speed');

var storedCity = JSON.parse(window.localStorage.getItem('storedCity'));

// If there is no search history, nothing happens. If there is a search history, the most recent city search's results will load on refresh/load
if (storedCity == null) {
    storedCity = [];
} 

printSearchHistory();

$('form').on("submit", function(event) {
    event.preventDefault();
    weatherSearch();
});

if (storedCity.length > 0) {
    citySearched.val(storedCity[storedCity.length - 1]);
    weatherSearch();
}

function weatherSearch() {
    var citySearchVal = citySearched.val();
    var cityNoSpace = citySearchVal.replace(/ /g, '');

    var cityIndex = storedCity.indexOf(citySearchVal)

    if (cityIndex === -1) {
        storedCity.push(citySearchVal);
    } else {
        storedCity.splice(cityIndex, 1);
        storedCity.push(citySearchVal);
    }

    window.localStorage.setItem('storedCity',JSON.stringify(storedCity));

    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityNoSpace + '&units=imperial&appid=e779588a0591b7492fc753e8f6d82879';

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response) {
            console.log(response);

            var weatherIcon = response.weather[0].icon

            date.text(new Date().toLocaleDateString('en-US', {timeZoneName: 'short'}));
            city.text(response.name);
            icon.attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon + '@2x.png');

            temp.text(response.main.temp + " °F");
            humidity.text(response.main.humidity + "%");
            windSpeed.text(response.wind.speed + " MPH");

            var cityLat = response.coord.lat;
            var cityLon = response.coord.lon;

            var queryURL = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + cityLat + "&lon=" + cityLon + '&appid=e779588a0591b7492fc753e8f6d82879';

            $.ajax({
                url: queryURL,
                method: "GET"
            })
                .then(function(response) {
                    console.log(response);

                    uvIndex.text(response.value);

                        if (response.value < 2) {
                            uvIndex.attr('class', 'bg-success');
                        } else if (response.value > 3 && response.value < 5) {
                            uvIndex.attr('class', 'bg-warning');
                        } else if (response.value > 5) {
                            uvIndex.attr('class', 'bg-danger');
                        }
                    });
        });



    var queryURL2 = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityNoSpace + '&units=imperial&appid=e779588a0591b7492fc753e8f6d82879';

    $.ajax({
        url: queryURL2,
        method: "GET"
    })
        .then(function(response) {
            console.log(response);
            var numb = 1;

            for (var i = 0; i < response.list.length; i++) {
                if (response.list[i].dt_txt.indexOf('21:00:00') >= 0) {
                    $('#5-day-date-' + numb).text(new Date(response.list[i].dt_txt).toLocaleDateString('en-US', {timeZoneName: 'short'}));
                    $('#weather-icon-' + numb).attr('src', 'https://openweathermap.org/img/wn/' + response.list[i].weather[0].icon + '@2x.png');
                    $('#5-day-temp-' + numb).text('Temperature: ' + response.list[i].main.temp_max + " °F");
                    $('#5-day-humidity' + numb).text('Humidity: ' + response.list[i].main.humidity + "%");

                    numb++;
                }
            }
        });
        
    printSearchHistory();
}


function printSearchHistory() {
    searchHistory.empty();
    if (storedCity.length > 0) {
        for (var i = 0; i < storedCity.length; i++){
            var entry = $('<button>');
            entry.data('city', storedCity[i]);
            entry.text(storedCity[i]);
            entry.on('click', function(event) {
                event.preventDefault();
                
                citySearched.val($(this).data('city'));

                weatherSearch();
                console.log(event);
            });
            searchHistory.prepend(entry);
        }
    }
}
