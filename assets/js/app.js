var inputVal = document.querySelector('#input');
var searchBtn = document.querySelector('#search-btn');
var cityVal = document.querySelector('#city-name');
var dateVal = document.querySelector('#date');
var tempVal = document.querySelector('#city-temp');
var humidityVal = document.querySelector('#city-humidity');
var windSpeedVal = document.querySelector('#city-wind-speed');
var UVindexVal = document.querySelector('#city-UV-index');
var weatherCards = document.querySelector('#weather-cards');
var cityIcon = document.querySelector('#city-icon');

searchBtn.addEventListener('click', function() {
    var city = inputVal.value;
    inputVal.value = '';
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=8a12ce2b06e066c3bd155bf0d0ac6c6e';
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                getApiOneCall(data, city);
            })
        } else {
            alert('Error: ' + response.status);
        }
    });
});

var getApiOneCall = function(data, city) {
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    cityVal.textContent = city;
    tempVal.textContent = 'Temperature: ';
    humidityVal.textContent = 'Humidity: ';
    windSpeedVal.textContent = 'Wind Speed: ';
    UVindexVal.textContent = 'UV index: ';
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&units=imperial&appid=8a12ce2b06e066c3bd155bf0d0ac6c6e';
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                getApiData(data);
            })
        } else {
            alert ('Error: '+ response.status);
            return;
        }
    })
    saveCity(city);
};

var getApiData = function(data) {
    var temp = data.current.temp;
    var humidity = data.current.humidity;
    var windSpeed = data.current.wind_speed;
    var UVindex = data.current.uvi;
    var date = new Date();
    var icon = data.current.weather[0].icon;
    var daily = data.daily;
    displayDailyData(daily);
    date = date.getMonth()+1 + '/' + date.getDate() + '/' + date.getFullYear();
    displayApiData(temp, humidity, windSpeed, UVindex, date, icon);
};

var displayApiData = function(temp, humidity, windSpeed, UVindex, date, icon) {
    dateVal.textContent = date;
    tempVal.textContent = 'Temperature: '+temp+' F';
    humidityVal.textContent = 'Humidity: ' + humidity + '%';
    windSpeedVal.textContent = 'Wind Speed: ' + windSpeed + ' mph';
    UVindexVal.textContent = 'UV index: ' + UVindex;
    var iconSrc = 'http://openweathermap.org/img/wn/'+icon+'@2x.png'
    cityIcon.setAttribute('src', iconSrc);
};

var displayDailyData = function(daily) {
    while(weatherCards.firstChild) {
        weatherCards.firstChild.remove();
    }
    for (i=1; i < 6; i++) {
        var dailyTemp = daily[i].temp.day;
        var dailyHumidity = daily[i].humidity;
        var date = new Date();
        date = date.getMonth()+1 + '/' + (date.getDate()+i) + '/' + date.getFullYear();
        var icon = daily[i].weather[0].icon;
        createWeatherCards(dailyHumidity, dailyTemp, date, icon);
    }
};

var createWeatherCards = function(hum, temp, date, icon) {
        
        var cardDiv = document.createElement('div');
        cardDiv.setAttribute('class', 'card bg-primary text-white p-2 m-2');
        var cardTitle = document.createElement('h5');
        cardTitle.setAttribute('class', 'card-title text-center');
        cardTitle.textContent = date;
        var iconCon = document.createElement('img');
        var iconSrc = 'http://openweathermap.org/img/wn/'+icon+'@2x.png'
        iconCon.setAttribute('src', iconSrc);

        var cardBody1 = document.createElement('p');
        cardBody1.setAttribute('class', 'card-text');
        cardBody1.textContent = "Temperature: " + temp + ' F';
        var cardBody2 = document.createElement('p');
        cardBody2.setAttribute('class', 'card-text');
        cardBody2.textContent = 'Humidity: ' + hum + '%';
        cardDiv.appendChild(cardTitle);
        cardDiv.appendChild(iconCon);
        cardDiv.appendChild(cardBody1);
        cardDiv.appendChild(cardBody2);
        weatherCards.appendChild(cardDiv);
        
};

var saveCity = function(city) {
    var cities = JSON.parse(localStorage.getItem('cities'));
    if (cities == null) {
        cities = [];
    }
    for (i = 0; i < cities.length; i++) {
        if (city === cities[i]) {
            return;
        }
    }
    cities.push(city);
    localStorage.setItem('cities', JSON.stringify(cities));

    var btn = document.createElement('button');
    btn.setAttribute('class', 'btn w-100 p-2 m-1');
    btn.setAttribute('onclick', 'existingVal(this.value)');
    btn.setAttribute('value', city);
    btn.textContent = city;
    document.querySelector('#search-column').appendChild(btn);
    console.log(btn);
};

var firstLoad = function() {
    var cities = JSON.parse(localStorage.getItem('cities'));
    console.log(cities);
    console.log(cities.length);
    for (var i = 0; i < cities.length; i++) {
        var btn = document.createElement('button');
        btn.setAttribute('class', 'btn w-100 p-2 m-1');
        btn.setAttribute('onclick', 'existingVal(this.value)');
        btn.setAttribute('value', cities[i]);
        btn.textContent = cities[i];
        document.querySelector('#search-column').appendChild(btn);
    }
};
firstLoad();

var existingVal = function(city) {
    console.log(city);
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=8a12ce2b06e066c3bd155bf0d0ac6c6e';
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                getApiOneCall(data, city);
            })
        } else {
            alert('Error: ' + response.status);
        }
    });
};