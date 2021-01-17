var inputVal = document.querySelector('#input');
var searchBtn = document.querySelector('#search-btn');
var cityVal = document.querySelector('#city-name');
var dateVal = document.querySelector('#date');
var tempVal = document.querySelector('#city-temp');
var humidityVal = document.querySelector('#city-humidity');
var windSpeedVal = document.querySelector('#city-wind-speed');
var UVindexVal = document.querySelector('#city-UV-index');
var weatherCards = document.querySelector('#weather-cards');

searchBtn.addEventListener('click', function() {
    var city = inputVal.value;
    inputVal.value = '';
    cityVal.textContent = city;
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=8a12ce2b06e066c3bd155bf0d0ac6c6e';
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                getApiOneCall(data);
            })
        } else {
            alert('Error: ' + response.status);
        }
    });
});

var getApiOneCall = function(data) {
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&units=imperial&appid=8a12ce2b06e066c3bd155bf0d0ac6c6e';
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                getApiData(data);
            })
        } else {
            alert ('Error: '+ response.status);
        }
    })  
};

var getApiData = function(data) {
    var temp = data.current.temp;
    var humidity = data.current.humidity;
    var windSpeed = data.current.wind_speed;
    var UVindex = data.current.uvi;
    var date = new Date();
    var daily = data.daily;
    displayDailyData(daily);
    date = date.getMonth()+1 + '/' + date.getDate() + '/' + date.getFullYear();
    displayApiData(temp, humidity, windSpeed, UVindex, date);
};

var displayApiData = function(temp, humidity, windSpeed, UVindex, date) {
    dateVal.textContent = date;
    tempVal.textContent = 'Temperature: '+temp+' F';
    humidityVal.textContent = 'Humidity: ' + humidity + '%';
    windSpeedVal.textContent = 'Wind Speed: ' + windSpeed + ' mph';
    UVindexVal.textContent = 'UV index: ' + UVindex;
};

var displayDailyData = function(daily) {
    for (i=1; i < 6; i++) {
        var dailyTemp = daily[i].temp.day;
        var dailyHumidity = daily[i].humidity;
        var date = new Date();
        date = date.getMonth()+1 + '/' + (date.getDate()+i) + '/' + date.getFullYear();
        createWeatherCards(dailyHumidity, dailyTemp, date);
    }
};

var createWeatherCards = function(hum, temp, date) {
        var cardDiv = document.createElement('div');
        cardDiv.setAttribute('class', 'card bg-primary text-white p-2 m-2');
        var cardTitle = document.createElement('h5');
        cardTitle.setAttribute('class', 'card-title');
        cardTitle.textContent = date;
        var cardBody1 = document.createElement('p');
        cardBody1.setAttribute('class', 'card-text');
        cardBody1.textContent = "Temperature: " + temp;
        var cardBody2 = document.createElement('p');
        cardBody2.setAttribute('class', 'card-text');
        cardBody2.textContent = 'Humidity: ' + hum;
        cardDiv.appendChild(cardTitle);
        cardDiv.appendChild(cardBody1);
        cardDiv.appendChild(cardBody2);
        weatherCards.appendChild(cardDiv);
        
};