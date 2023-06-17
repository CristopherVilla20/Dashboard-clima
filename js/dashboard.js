let plot = (data) => {
  const ctx = document.getElementById("myChart");
  const dataset = {
    labels: data.hourly.time /* ETIQUETA DE DATOS */,
    datasets: [
      {
        type: "line",
        label: "Temperatura semanal" /* ETIQUETA DEL GRÁFICO */,
        data: data.hourly.temperature_2m /* ARREGLO DE DATOS */,
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        type: "line",
        label: "Uv index",
        data: data.hourly.uv_index,
        fill: true,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  };

  const config = {
    type: "scatter",
    data: dataset,
  };
  const chart = new Chart(ctx, config);
};

let load = (data) => {
  console.log(data);

  plot(data);


  let timezone = data["timezone"];
  let timezoneHTML = document.getElementById("timezone");
  timezoneHTML.textContent = timezone;

  let gtm = data["timezone_abbreviation"];
  let gtmHTML = document.getElementById("gtm");
  gtmHTML.textContent = "GTM" + gtm;

  let elevation = data["elevation"];
  let elevationHTML = document.getElementById("elevation");
  elevationHTML.textContent = elevation;
  
  //CLIMA A TIEMPO REAL -->
  let currentWeather = data.current_weather.temperature;
  let currentWeatherHTML = document.getElementById("currentWeather");
  currentWeatherHTML.textContent =
    currentWeather + data.hourly_units.temperature_2m;
  //<--CLIMA A TIEMPO REAL
  
  
  //LOCALIDAD -->
  let locationBannerHTML = document.getElementById("locationBanner");
  locationBannerHTML.textContent = data.timezone;
  //<--LOCALIDAD

  //TIEMPO ACTUAL -->
  const currentDateTime = new Date();
  let currentHour = currentDateTime.getHours();
  const currentMinutes = currentDateTime.getMinutes();
  let timePeriod = "am";

  // Convertir a formato de 12 horas y determinar el período (am o pm)
  if (currentHour >= 12) {
    timePeriod = "pm";
    if (currentHour > 12) {
      currentHour -= 12;
    }
  } else if (currentHour === 0) {
    currentHour = 12;
  }

  // Agregar un 0 inicial si los minutos son menores a 10
  const formattedMinutes =
    currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;

  // Construir la cadena de tiempo
  const currentTime = currentHour + ":" + formattedMinutes + " " + timePeriod;

  let horaActualHTML = document.getElementById("horaActual");
  horaActualHTML.textContent = currentTime;
  //<--TIEMPO ACTUAL

  //DIA ACTUAL -->
  const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  let diaActual = document.getElementById("diaActual");
  const currentDayIndex = currentDateTime.getDay();
  const currentDayOfWeek = daysOfWeek[currentDayIndex];
  diaActual.textContent = currentDayOfWeek;
  //<--DIA ACTUAL

  //DIA O NOCHE -->
  let currentIsDay = data.current_weather.is_day;
  let bannerPrincipalHTML =document.getElementById("bannerPrincipal")
  if(currentIsDay == 1){
    bannerPrincipalHTML.classList.add("banner-day");
  }else{
    bannerPrincipalHTML.classList.add("banner-night")
  }
  //<-- DIA O NOCHE

  //ESTADO DEL CLIMA -->
  let weatherCodeHTML = document.getElementById("weatherCode");
  switch (data.current_weather.weathercode) {
    case 0:
      weatherCodeHTML.src = "./img/despejado.png";
      weatherCodeHTML.alt = "Cielo despejado";
      break;
      case 1:
      case 2:
      case 3:
      weatherCodeHTML.src = "./img/nublado.png";
      weatherCodeHTML.alt = "Nublado";
      break;
      case 51:
      case 53:
      case 55:
      weatherCodeHTML.src = "./img/llovizna.png";
      weatherCodeHTML.alt = "Llovizna";
      break;
      case 61:
      case 63:
      case 65:
      weatherCodeHTML.src = "./img/lluvia.png";
      weatherCodeHTML.alt = "Lluvia";
      break;
      case 95:
      weatherCodeHTML.src = "./img/tormenta.png";
      weatherCodeHTML.alt = "Tormenta eléctrica leve";
      break;
  
    default:
      weatherCodeHTML.src = "./img/climaDesconocido.png" ;
      weatherCodeHTML.alt = "Clima desconocido";
      break;
  }
  //ESTADO DEL CLIMA <--
  
};

(function () {
  let meteo = localStorage.getItem("meteo");
  if (meteo == null) {
    loadData();
  } else {
    let cachedData = JSON.parse(meteo);
    let currentTime = new Date().getTime();
    let cachedTime = new Date(cachedData.fetchTime).getTime();
    let timeDiff = currentTime - cachedTime;
    // Actualizar los datos si ha pasado más de 5 minutos (300,000 ms)
    if (timeDiff > 300000) {
      loadData();
    } else {
      load(cachedData);
    }
  }

  function loadData() {
    let URL =
      "https://api.open-meteo.com/v1/forecast?latitude=-2.20&longitude=-79.89&hourly=temperature_2m,uv_index,is_day&current_weather=true&timezone=auto";

    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        data.fetchTime = new Date(); // Agregar la marca de tiempo de la solicitud
        load(data);

        /* GUARDAR DATA EN LA MEMORIA */
        localStorage.setItem("meteo", JSON.stringify(data));
      })
      .catch(console.error);
  }
})();
