(function () {
  let URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-2.20&longitude=-79.89&hourly=temperature_2m&timezone=auto";
  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let timezone = data["timezone"]
      
      let timezoneHTML = document.getElementById("timezone")
      timezoneHTML.textContent = timezone

      let gtm = data["timezone_abbreviation"]
      let gtmHTML = document.getElementById("gtm")
      gtmHTML.textContent = "GTM"+ gtm

      let elevation = data["elevation"]
      let elevationHTML = document.getElementById("elevation")
      elevationHTML.textContent = elevation

      
    })
    .catch(console.error);
})();
