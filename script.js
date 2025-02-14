// Wacht tot de volledige HTML-pagina is geladen voordat het script wordt uitgevoerd
document.addEventListener("DOMContentLoaded", function () {
  // Zoek de zoekknop en het invoerveld in de HTML op
  const searchButton = document.getElementById("searchButton");
  const cityInput = document.getElementById("city");

  // Voeg een event listener toe aan de zoekknop zodat bij een klik de functie getWeather wordt uitgevoerd
  searchButton.addEventListener("click", getWeather);

  // Luister naar de 'Enter'-toets in het invoerveld zodat de gebruiker ook kan zoeken door op Enter te drukken
  cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      getWeather();
    }
  });
});

// Functie om het weer op te halen
function getWeather() {
  // OpenWeatherMap API sleutel (let op: deze sleutel zou normaal in een beveiligde omgeving moeten staan)
  const apiKey = "7b6e1084562c8ac1de1e65c6976139cb";
  // Haal de ingevoerde stad op uit het invoerveld
  const city = document.getElementById("city").value;

  // Controleer of de gebruiker een stad heeft ingevoerd, zo niet, toon een waarschuwing
  if (!city) {
    alert("Voer een stad in alstublieft");
    return;
  }

  // API URL's om het huidige weer en de weersvoorspelling op te halen
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  // Huidige weersgegevens ophalen
  fetch(currentWeatherUrl)
    .then((response) => response.json()) // Converteer de respons naar JSON
    .then((data) => displayWeather(data)) // Stuur de data naar de displayWeather functie om weer te geven
    .catch((error) => {
      console.error("Fout bij ophalen van huidige weergegevens:", error);
      alert("Fout bij ophalen van huidige weergegevens. Probeer het opnieuw.");
    });

  // Weersvoorspelling ophalen
  fetch(forecastUrl)
    .then((response) => response.json()) // Converteer de respons naar JSON
    .then((data) => displayHourlyForecast(data.list)) // Stuur de lijst met voorspellingen naar displayHourlyForecast
    .catch((error) => {
      console.error("Fout bij ophalen van weersvoorspelling:", error);
      alert("Fout bij ophalen van weersvoorspelling. Probeer het opnieuw.");
    });
}

// Functie om het huidige weer weer te geven
function displayWeather(data) {
  // Zoek de div waarin het weer wordt weergegeven
  const weatherDiv = document.getElementById("weather");

  // Haal het icoon op van OpenWeatherMap
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  // Haal de temperatuur op en rond deze af naar 1 decimaal
  const temp = data.main.temp.toFixed(1);

  // Voeg de gegevens toe aan de div
  weatherDiv.innerHTML = `
        <h2 class="text-xl font-semibold">${data.name}, ${data.sys.country}</h2>
        <div class="flex items-center justify-center">
            <img src="${iconUrl}" alt="Weer icoon">
            <p class="text-gray-700">${data.weather[0].description}</p>&nbsp;
            <p class="text-lg font-bold">${temp}°C</p>
        </div>
    `;
}

// Functie om de weersvoorspelling weer te geven
function displayHourlyForecast(forecastList) {
  // Zoek de div waarin de voorspelling wordt weergegeven
  const forecastDiv = document.getElementById("forecast");

  // Maak de div eerst leeg zodat oude data wordt verwijderd
  forecastDiv.innerHTML = "";

  // Loop door de eerste 10 voorspellingen (elke voorspelling staat voor 3 uur)
  forecastList.slice(0, 10).forEach((item) => {
    // Converteer de tijd van Unix-timestamp naar een leesbaar uur-formaat (bv. "14:00")
    const dateTime = new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Haal het icoon en temperatuur op
    const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
    const temp = item.main.temp.toFixed(1);

    // Voeg elk weerblokje toe aan de forecastDiv
    forecastDiv.innerHTML += `
            <div class="swiper-slide bg-white p-4 rounded-lg shadow-md text-center">
                <p class="font-semibold">${dateTime}</p>
                <img src="${iconUrl}" alt="Weer icoon" class="mx-auto">
                <p class="text-lg font-bold">${temp}°C</p>
                <p class="text-gray-600">${item.weather[0].description}</p>
            </div>
        `;
  });

  // Initialiseer de Swiper (carousel voor de voorspellingen)
  new Swiper(".mySwiper", {
    slidesPerView: 2, // Standaard 2 slides per keer
    spaceBetween: 10, // Ruimte tussen de slides
    pagination: {
      el: ".swiper-scrollbar", // De scrollbar van Swiper
      clickable: true,
    },
    breakpoints: {
      640: { slidesPerView: 2 }, // Op schermen groter dan 640px: 2 slides per keer
      768: { slidesPerView: 3 }, // Op schermen groter dan 768px: 3 slides per keer
      1024: { slidesPerView: 4 }, // Op schermen groter dan 1024px: 4 slides per keer
    },
  });
}
