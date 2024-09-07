"use strict";
let coords = {};
function putMarker(
  L,
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
  let map = L.map("map").setView([lat, long], zoom);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  map.on("click", function (e) {
    console.log(e);
    putMarker(L, map, e.latlng.lat, e.latlng.lng);
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

initial();
