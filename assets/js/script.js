function initPage() {
    var userCity = document.getElementById("city-input");
    var searchBtn = document.getElementById("search-btn");
    var clearStorage = document.getElementById("clear-storage");
    var userCityName = document.getElementById("city-name");
    var currentWeatherPhoto = document.getElementById("current-weather-photo");
    var temperature = document.getElementById("temp");
    var humidity = document.getElementById("hum");
    var wind = document.getElementById("winSpd");
    var currentUVElement = document.getElementById("UV-index");
    var recentHistory = document.getElementById("recent-history");
    var fiveDayForecast = document.getElementById("five-day");
    var todaysWeather = document.getElementById("todays-weather");
    var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    var API = "73b276a0171bedf09909b0e18230ffdd";

    function getWeather(cityName) {

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + API;
        axios.get(queryURL)
            .then(function (response) {

                todaysWeather.classList.remove("d-none");


                var today = new Date(response.data.dt * 1000);
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();
                userCityName.innerHTML = response.data.name + " (" + mm + "/" + dd + "/" + yyyy + ") ";
                var weatherIcon = response.data.weather[0].icon;
                currentWeatherPhoto.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
                currentWeatherPhoto.setAttribute("alt", response.data.weather[0].description);
                temperature.innerHTML = "Temperature: " + kelvinToFahrenheit(response.data.main.temp) + "&#176F";
                humidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                wind.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";


                var lat = response.data.coord.lat;
                var lon = response.data.coord.lon;
                var UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API + "&cnt=1";
                axios.get(UVQueryURL)
                    .then(function (response) {
                        var UVIndex = document.createElement("span");


                        if (response.data[0].value < 4) {
                            UVIndex.setAttribute("class", "badge bg-success");
                        } else if (response.data[0].value < 8) {
                            UVIndex.setAttribute("class", "badge bg-warning");
                        } else {
                            UVIndex.setAttribute("class", "badge bg-danger");
                        }

                        UVIndex.innerHTML = response.data[0].value;
                        currentUVElement.innerHTML = "UV Index: ";
                        currentUVElement.append(UVIndex);
                    });


                var cityID = response.data.id;
                var forecast = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + API;
                axios.get(forecast)
                    .then(function (response) {
                        fiveDayForecast.classList.remove("d-none");


                        var forecastLists = document.querySelectorAll(".forecast")
                        for (i = 0; i < forecastLists.length; i++) {
                            forecastLists[i].innerHTML = "";
                            var castIndex = i * 8 + 4;
                            var castDate = new Date(response.data.list[castIndex].dt * 1000);
                            var castDay = castDate.getDate();
                            var castMonth = castDate.getMonth() + 1;
                            var castYear = castDate.getFullYear();
                            var castTitle = document.createElement("p");
                            castTitle.setAttribute("class", "mt-4 mb-0 forecast-date");
                            castTitle.innerHTML = castMonth + "/" + castDay + "/" + castYear;
                            forecastLists[i].append(castTitle);


                            var fiveDayIcon = document.createElement("img");
                            fiveDayIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[castIndex].weather[0].icon + "@2x.png");
                            fiveDayIcon.setAttribute("alt", response.data.list[castIndex].weather[0].description);
                            forecastLists[i].append(fiveDayIcon);
                            var weatherTemp = document.createElement("p");
                            weatherTemp.innerHTML = "Temp: " + kelvinToFahrenheit(response.data.list[castIndex].main.temp) + " &#176F";
                            forecastLists[i].append(weatherTemp);
                            var weatherWind = document.createElement("p");
                            weatherWind.innerHTML = "Wind Speed: " + response.data.list[castIndex].wind.speed + "MPH";
                            forecastLists[i].append(weatherWind);
                            var weatherHumidity = document.createElement("p");
                            weatherHumidity.innerHTML = "Humidity: " + response.data.list[castIndex].main.humidity + "%";
                            forecastLists[i].append(weatherHumidity);
                        }
                    })
            });
    }


    searchBtn.addEventListener("click", function () {
        var searchTerm = userCity.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        displaySearchHistory();
    });


    clearStorage.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        displaySearchHistory();
    });

    function kelvinToFahrenheit(k) {
        return Math.floor((k - 273.15) * 1.8 + 32);
    }

    function displaySearchHistory() {
        recentHistory.innerHTML = "";
        for (var i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control d-block bg-secondary text-white text-center");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function () {
                getWeather(historyItem.value);
            })
            recentHistory.append(historyItem);
        }
    }

    displaySearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
}

initPage();