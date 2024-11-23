const apiKey = 'ec9913bc6e281ef438e743e7e84639cd';
const getWeatherButton = document.getElementById('getWeather');
const currentWeatherElement = document.getElementById('currentWeather');
const forecastElement = document.getElementById('forecast');
const dateFormater = new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'full',
    timeStyle: 'short'
});

getWeatherButton.addEventListener('click', () => {
    const city = document.getElementById('address').value.trim();
    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    // Zapytanie do API Current Weather za pomocą XMLHttpRequest
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', currentWeatherUrl, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(xhr.responseText);

            const data = JSON.parse(xhr.responseText);
            const currentDateTime = dateFormater.format(new Date());
            const temp = data.main.temp.toFixed(1);
            const feelsLike = data.main.feels_like.toFixed(1);
            const description = data.weather[0].description;
            const icon = data.weather[0].icon;

            currentWeatherElement.innerHTML = `
                <div class="forecast-item">
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" title="${description}">
                    <div>
                        <div class="date">${currentDateTime}</div>
                        <div class="temp">${temp} °C</div>
                        <div class="details">
                            <span>odczuwalna:</span> ${feelsLike} °C<br>
                            ${description}
                        </div>
                    </div>
                </div>
            `;
        } else {
            console.error('Error fetching current weather:', xhr.responseText);
            currentWeatherElement.textContent = 'Error fetching current weather.';
        }
    };
    xhr.send();

    // Zapytanie do API 5 day forecast za pomocą Fetch API
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
    fetch(forecastUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error fetching forecast.');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);

            forecastElement.innerHTML = '';
            const forecasts = data.list.filter((item, index) => index % 8 === 0); // Jedna prognoza na dzień
            forecasts.forEach((forecast) => {
                const date = dateFormater.format(new Date(forecast.dt * 1000));
                const temp = forecast.main.temp.toFixed(1);
                const feelsLike = forecast.main.feels_like.toFixed(1);
                const description = forecast.weather[0].description;
                const icon = forecast.weather[0].icon;

                const forecastItem = document.createElement('div');
                forecastItem.classList.add('forecast-item');
                forecastItem.innerHTML = `
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" title="${description}">
                    <div>
                        <div class="date">${date}</div>
                        <div class="temp">${temp} °C</div>
                        <div class="details">
                            <span>odczuwalna:</span> ${feelsLike} °C<br>
                            ${description}
                        </div>
                    </div>
                `;
                forecastElement.appendChild(forecastItem);
            });
        })
        .catch((error) => {
            console.error('Error fetching forecast:', error.message);
            forecastElement.textContent = error.message;
        });
});
