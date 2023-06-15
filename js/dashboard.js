let plot = (data) => {
  const ctx = document.getElementById("myChart");
  const dataset = {
    labels: data.hourly.time /* ETIQUETA DE DATOS */,
    datasets: [
      {
        type: "line",
        label: "Temperatura semanal" /* ETIQUETA DEL GRÁFICO */,
        data: data.hourly.temperature_2m /* ARREGLO DE DATOS */,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        type: "line",
        label: "Uv index",
        data: data.hourly.uv_index,
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
      }
    
    ],
  };

  const config = {
    type: 'scatter',
    data: dataset,
  };
  const chart = new Chart(ctx, config);
 
};

let load = (data) => { 
  console.log(data);
      let timezone = data["timezone"];

      let timezoneHTML = document.getElementById("timezone");
      timezoneHTML.textContent = timezone;

      let gtm = data["timezone_abbreviation"];
      let gtmHTML = document.getElementById("gtm");
      gtmHTML.textContent = "GTM" + gtm;

      let elevation = data["elevation"];
      let elevationHTML = document.getElementById("elevation");
      elevationHTML.textContent = elevation;
      plot(data);
 }

(
  function () {
    let meteo = localStorage.getItem('meteo');
    if(meteo == null) {
      let URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.20&longitude=-79.89&hourly=temperature_2m,uv_index&timezone=auto';
          
      fetch(URL)
      .then(response => response.json())
      .then(data => {
          load(data)
  
          /* GUARDAR DATA EN LA MEMORIA */
          localStorage.setItem("meteo", JSON.stringify(data))
      })
      .catch(console.error);
  
    } else {
  
        /* CARGAR DATA DESDE LA MEMORIA */
        load(JSON.parse(meteo))
    }
   }
)();



