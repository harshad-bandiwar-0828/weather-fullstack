const cityInput = document.getElementById("cityInput");
const currentWeather = document.getElementById("currentWeather");
const forecastDiv = document.getElementById("forecast");
const forecastTitle = document.getElementById("forecastTitle");
const loader = document.getElementById("loader");

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return alert("Enter city name");

  loader.classList.remove("hidden");
  currentWeather.classList.add("hidden");
  forecastDiv.innerHTML = "";
  forecastTitle.classList.add("hidden");

  try {
    const res = await fetch(`/api/weather?city=${city}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    /* CURRENT */
    document.getElementById("cityName").innerText = data.current.name;
    document.getElementById("temperature").innerText =
      `🌡️ ${data.current.main.temp} °C`;
    document.getElementById("condition").innerText =
      `🌥️ ${data.current.weather[0].description}`;
    document.getElementById("humidity").innerText =
      `💧 Humidity: ${data.current.main.humidity}%`;
    document.getElementById("wind").innerText =
      `🌬️ Wind: ${data.current.wind.speed} m/s`;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;

    currentWeather.classList.remove("hidden");

    /* 5 DAY FORECAST */
    const dailyForecast = data.forecast.list.filter(item =>
      item.dt_txt.includes("12:00:00")
    );

    dailyForecast.forEach((day, index) => {
      const date = new Date(day.dt_txt).toLocaleDateString("en-IN", {
        weekday: "short"
      });

      const isToday = index === 0 ? "today" : "";

      forecastDiv.innerHTML += `
        <div class="forecast-card ${isToday}">
          <p>${date}</p>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
          <p>${day.main.temp}°C</p>
        </div>
      `;
    });

    forecastTitle.classList.remove("hidden");

  } catch (err) {
    alert(err.message || "Failed to fetch weather");
  } finally {
    loader.classList.add("hidden");
  }
}
