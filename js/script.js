"use strict";
/*********************************ELEMENTS*********************************/
let typeSelector = document.querySelector("select");
let cadence = document.querySelectorAll(".run-input");
let gain = document.querySelectorAll(".cylce-input");
let form = document.querySelector(".form");
let coords = {};
let map;
let popupLoc = {};
/*********************************UTILITIES*********************************/
function putMarker(
  map,
  lat,
  long,
  msg = `A pretty CSS popup.<br> Easily customizable.`
) {
  L.marker([lat, long])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: "cylcling border-start border-5 rounded-2",
      })
    )
    .setPopupContent(msg)
    .openPopup();
}
function renderMap(lat, long, zoom = 13) {
  map = L.map("map").setView([lat, long], zoom);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  map.on("click", function (e) {
    form.classList.remove("d-none");
    popupLoc.lat = e.latlng.lat;
    popupLoc.long = e.latlng.lng;
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    putMarker(map, popupLoc.lat, popupLoc.long);
    clearInput();
    !form.classList.contains("d-none") && form.classList.add("d-none");
  });
}
function clearInput() {
  document.querySelectorAll("input").forEach((el) => {
    el.value = "";
  });
}
function initial() {
  navigator.geolocation.getCurrentPosition(
    function (location) {
      ({ latitude: coords.lat, longitude: coords.long } = location.coords);
      renderMap(coords.lat, coords.long);
    },
    function () {
      alert("Couldin't get your location");
    }
  );
}

/*********************************EVENTS*********************************/
typeSelector.addEventListener("change", function (e) {
  cadence.forEach((el) => el.classList.toggle("d-none"));
  gain.forEach((el) => el.classList.toggle("d-none"));
});
initial();
