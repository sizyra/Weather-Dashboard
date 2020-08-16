
var citySearchForm = $('#city-search-form');
var citySearched = $('#city-searched');
var searchHistory = $('#search-history');

var city = $('#city');
var icon = $('#weather-icon');
var temp = $('#temp');
var uvIndex = $('#uv-index');
var humidity = $('#humidity');
var windSpeed = $('#wind-speed');

var fiveDateOne = $('#5-day-date-1');
var weatherIconOne = $('#weather-icon-1');
var fiveTempOne = $('#5-day-temp-1');
var fiveHumOne = $('#5-day-humidity-1');

var fiveDateTwo = $('#5-day-date-2');
var weatherIconTwo = $('#weather-icon-2');
var fiveTempTwo = $('#5-day-temp-2');
var fiveHumTwo = $('#5-day-humidity-2');

var fiveDateThree = $('#5-day-date-3');
var weatherIconThree = $('#weather-icon-3');
var fiveTempThree = $('#5-day-temp-3');
var fiveHumThree = $('#5-day-humidity-3');

var fiveDateFour = $('#5-day-date-4');
var weatherIconFour = $('#weather-icon-4');
var fiveTempFour = $('#5-day-temp-4');
var fiveHumFour = $('#5-day-humidity-4');

var fiveDateFive = $('#5-day-date-5');
var weatherIconFive = $('#weather-icon-5');
var fiveTempFive = $('#5-day-temp-5');
var fiveHumFive = $('#5-day-humidity-5');



$('form').on("submit", function(event) {
    event.preventDefault();

    var citySearchVal = citySearched.val();
    var cityNoSpace = citySearchVal.replace(/ /g, '');

    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityNoSpace + '&units=imperial&appid=e779588a0591b7492fc753e8f6d82879';

    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    
        .then(function(response) {
            console.log(response);

            var weatherIcon = response.weather[0].icon

            city.text(response.name);
            icon.attr('src', 'http://openweathermap.org/img/wn/' + weatherIcon + '@2x.png');

            temp.text(response.main.temp + " °F");
            humidity.text(response.main.humidity + "%");
            windSpeed.text(response.wind.speed + " MPH");

            var cityLat = response.coord.lat;
            var cityLon = response.coord.lon;

            var queryURL = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + cityLat + "&lon=" + cityLon + '&appid=e779588a0591b7492fc753e8f6d82879';
            console.log(queryURL);

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



    var queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityNoSpace + '&units=imperial&appid=e779588a0591b7492fc753e8f6d82879';

    console.log(queryURL)

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response) {
            console.log(response);

            var weatherIcon
        });
        

    printSearchHistory();
});

function printSearchHistory() {
    searchHistory.innerHTML = '';
    var storedCity
}