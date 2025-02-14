document.addEventListener("DOMContentLoaded", function () {
  // Zoekknop en invoerveld selecteren
  const searchButton = document.getElementById("searchButton");
  const cityInput = document.getElementById("city");

  // Klik event voor de zoekknop
  searchButton.addEventListener("click", getWeather);

  // Enter toets detecteren op het invoerveld
  cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      getWeather();
    }
  });
});

function getWeather() {
  const apiKey = "7b6e1084562c8ac1de1e65c6976139cb";
  const city = document.getElementById("city").value;

  if (!city) {
    alert("Voer een stad in alstublieft");
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => displayWeather(data))
    .catch((error) => {
      console.error("Fout bij ophalen van huidige weergegevens:", error);
      alert("Fout bij ophalen van huidige weergegevens. Probeer het opnieuw.");
    });

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => displayHourlyForecast(data.list))
    .catch((error) => {
      console.error("Fout bij ophalen van weersvoorspelling:", error);
      alert("Fout bij ophalen van weersvoorspelling. Probeer het opnieuw.");
    });
}

function displayWeather(data) {
  const weatherDiv = document.getElementById("weather");
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  const temp = data.main.temp.toFixed(1); // 1 decimaal achter de komma

  weatherDiv.innerHTML = `
        <h2 class="text-xl font-semibold">${data.name}, ${data.sys.country}</h2>
        <div class="flex items-center justify-center">
            <img src="${iconUrl}" alt="Weer icoon">
            <p class="text-gray-700">${data.weather[0].description}</p>&nbsp;
            <p class="text-lg font-bold">${temp}°C</p>
        </div>
    `;
}

function displayHourlyForecast(forecastList) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = ""; // Leegmaken voor nieuwe data

  forecastList.slice(0, 10).forEach((item) => {
    // Laat de komende 10 voorspellingen zien
    const dateTime = new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
    const temp = item.main.temp.toFixed(1); // 1 decimaal achter de komma

    forecastDiv.innerHTML += `
            <div class="swiper-slide bg-white p-4 rounded-lg shadow-md text-center">
                <p class="font-semibold">${dateTime}</p>
                <img src="${iconUrl}" alt="Weer icoon" class="mx-auto">
                <p class="text-lg font-bold">${temp}°C</p>
                <p class="text-gray-600">${item.weather[0].description}</p>
            </div>
        `;
  });

  // Initialiseer de Swiper
  new Swiper(".mySwiper", {
    slidesPerView: 2,
    spaceBetween: 10,
    pagination: {
      el: ".swiper-scrollbar",
      clickable: true,
    },
    breakpoints: {
      640: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
    },
  });
}
