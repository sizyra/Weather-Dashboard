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
    citySearched.val(storedCity[0])
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

    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response) {
            console.log(response);

            var weatherIcon = response.weather[0].icon

            // Found how to convert UNIX time to US date format at https://coderrocketfuel.com/article/convert-a-unix-timestamp-to-a-date-in-vanilla-javascript
            var todayUnix = response.dt;
            var todayMil = todayUnix * 1000;
            var todayObj = new Date(todayMil);
            var todayDate = todayObj.toLocaleDateString('en-US', {timeZoneName: 'short'});
            date.text(todayDate);

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



    var queryURL2 = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityNoSpace + '&units=imperial&appid=e779588a0591b7492fc753e8f6d82879';

    console.log(queryURL2)

    $.ajax({
        url: queryURL2,
        method: "GET"
    })
        .then(function(response) {
            console.log(response);
            var numb = 1;

            for (var i = 0; i < response.list.length; i++) {
                if (response.list[i].dt_txt.indexOf('15:00:00') >= 0) {
                    $('#5-day-date-' + numb).text(new Date(response.list[i].dt_txt).toLocaleDateString('en-US', {timeZoneName: 'short'}));
                    $('#5-day-')

                    numb++;
                }
            }
            // The forecast for 'tomorrow'
            var fiveDateOneUnix = response.list[7].dt;
            var fiveDateOneMil = fiveDateOneUnix * 1000;
            var fiveDateOneObj = new Date(fiveDateOneMil);
            var fiveDateOneDate = fiveDateOneObj.toLocaleDateString('en-US', {timeZoneName: 'short'});
            fiveDateOne.text(fiveDateOneDate);

            var weatherIconFirst = response.list[7].weather[0].icon;
            weatherIconOne.attr('src', 'http://openweathermap.org/img/wn/' + weatherIconFirst + '@2x.png')
            fiveTempOne.text('Temperature: ' + response.list[7].main.temp_max + " °F");
            fiveHumOne.text('Humidity: ' + response.list[2].main.humidity + "%");

            //The forecast in two days
            var fiveDateTwoUnix = response.list[15].dt;
            var fiveDateTwoMil = fiveDateTwoUnix * 1000;
            var fiveDateTwoObj = new Date(fiveDateTwoMil);
            var fiveDateTwoDate = fiveDateTwoObj.toLocaleDateString('en-US', {timeZoneName: 'short'});
            fiveDateTwo.text(fiveDateTwoDate);

            var weatherIconSecond = response.list[15].weather[0].icon;
            weatherIconTwo.attr('src', 'http://openweathermap.org/img/wn/' + weatherIconSecond + '@2x.png')
            fiveTempTwo.text('Temperature: ' + response.list[15].main.temp_max + " °F");
            fiveHumTwo.text('Humidity: ' + response.list[9].main.humidity + "%");

            //The forecast in three days
            var fiveDateThreeUnix = response.list[23].dt;
            var fiveDateThreeMil = fiveDateThreeUnix * 1000;
            var fiveDateThreeObj = new Date(fiveDateThreeMil);
            var fiveDateThreeDate = fiveDateThreeObj.toLocaleDateString('en-US', {timeZoneName: 'short'});
            fiveDateThree.text(fiveDateThreeDate);

            var weatherIconThird = response.list[23].weather[0].icon;
            weatherIconThree.attr('src', 'http://openweathermap.org/img/wn/' + weatherIconThird + '@2x.png')
            fiveTempThree.text('Temperature: ' + response.list[23].main.temp_max + " °F");
            fiveHumThree.text('Humidity: ' + response.list[17].main.humidity + "%");
            
            //The forecast in four days
            var fiveDateFourUnix = response.list[31].dt;
            var fiveDateFourMil = fiveDateFourUnix * 1000;
            var fiveDateFourObj = new Date(fiveDateFourMil);
            var fiveDateFourDate = fiveDateFourObj.toLocaleDateString('en-US', {timeZoneName: 'short'});
            fiveDateFour.text(fiveDateFourDate);

            var weatherIconFourth = response.list[31].weather[0].icon;
            weatherIconFour.attr('src', 'http://openweathermap.org/img/wn/' + weatherIconFourth + '@2x.png')
            fiveTempFour.text('Temperature: ' + response.list[31].main.temp_max + " °F");
            fiveHumFour.text('Humidity: ' + response.list[25].main.humidity + "%");

            //The forecast in five days
            var fiveDateFiveUnix = response.list[39].dt;
            var fiveDateFiveMil = fiveDateFiveUnix * 1000;
            var fiveDateFiveObj = new Date(fiveDateFiveMil);
            var fiveDateFiveDate = fiveDateFiveObj.toLocaleDateString('en-US', {timeZoneName: 'short'});
            fiveDateFive.text(fiveDateFiveDate);

            var weatherIconFifth = response.list[39].weather[0].icon;
            weatherIconFive.attr('src', 'http://openweathermap.org/img/wn/' + weatherIconFifth + '@2x.png')
            fiveTempFive.text('Temperature: ' + response.list[39].main.temp_max + " °F");
            fiveHumFive.text('Humidity: ' + response.list[33].main.humidity + "%");
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