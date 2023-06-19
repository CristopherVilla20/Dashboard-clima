let plot = (data) => {
  const ctx = document.getElementById("myChart");
  const dataset = {
    labels: data.hourly.time /* ETIQUETA DE DATOS */,
    datasets: [
      {
        yAxisID: 'yAxis1',
        xAxisID: 'xAxis1',
        type: "line",
        label: "Temperatura semanal" /* ETIQUETA DEL GRÁFICO */,
        data: data.hourly.temperature_2m /* ARREGLO DE DATOS */,
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192,0.3)",
     
      },
      {
        yAxisID: 'yAxis2',
        xAxisID: 'xAxis1',
        type: "line",
        label: "Uv index",
        data: data.hourly.uv_index,
        fill: true,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235,0.3)",
      },
      

    ],
  };

  const config = {
    type: "line",
    data: dataset,
    options: {
      responsive:true,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 20,
            },
            color: "rgb(255, 255, 255)",
            usePointStyle: false,
          },
        },
      },
      scales: {
        xAxis1: {
          ticks: {
            color:"white",
            autoSkipPadding: 30, // Espacio adicional entre etiquetas
          },
          grid: {
            display: true,
            drawOnChartArea: true,
            drawTicks: true,
            color: "rgba(255, 255, 255,0.5)"
          }
        },
        yAxis1: {
          ticks: { color: 'rgb(54, 162, 235)' },
            grid: {
            display: true,
            drawOnChartArea: true,
            drawTicks: true,
            color: "rgba(255, 255, 255,0.2)"
          }
        },
        yAxis2: {
          ticks: { color: 'rgb(75, 192, 192)' },
            grid: {
            display: true,
            drawOnChartArea: true,
            drawTicks: true,
            color: "rgba(255, 255, 255,0.2)"
          },
        }
      },
      elements:{
        point:{
          radius:2
        }
      }
    },
    
  };
  
  const chart = new Chart(ctx, config);
  console.log(chart);
  
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

let loadInocar = () => { 
  let URL_proxy = 'https://cors-anywhere.herokuapp.com/' // Coloque el URL de acuerdo con la opción de proxy
  let URL = URL_proxy + 'https://www.inocar.mil.ec/mareas/consultan.php';
  fetch(URL)
     	.then(response => response.text())
        .then(data => {
           const parser = new DOMParser();
           const xml = parser.parseFromString(data, "text/html");
           console.log(xml);
           let contenedorMareas = xml.getElementsByClassName('container-fluid')[0];
           console.log(contenedorMareas);
           let contenedorHTML = document.getElementById('table-container');
           contenedorHTML.innerHTML = contenedorMareas.innerHTML;
        })
        .catch(console.error);
}

(function () {
  let meteo = localStorage.getItem("meteo");
  if (meteo == null) {
    loadData();
  } else {
    let cachedData = JSON.parse(meteo);
    let currentTime = new Date().getTime();
    let cachedTime = cachedData.fetchTime ? new Date(cachedData.fetchTime).getTime() : null;
    let timeDiff = currentTime - cachedTime;
    // Actualizar los datos si ha pasado más de 5 minutos (300,000 ms)
    if (timeDiff > 300000) {
      loadData();
    } else {
      load(cachedData);
    }
    
  }
  loadInocar();

  function loadData() {
    let URL =
      "https://api.open-meteo.com/v1/forecast?latitude=-2.20&longitude=-79.89&hourly=temperature_2m,uv_index&current_weather=true&forecast_days=3&timezone=auto";

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
