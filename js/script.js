"use strict";
/*********************************ELEMENTS*********************************/
let typeSelector = document.querySelector("select");
let cadence = document.querySelectorAll(".run-input");
let gain = document.querySelectorAll(".cylce-input");
let form = document.querySelector(".form");

/*********************************THE MAIN CLASS*********************************/
class App {
  #map;
  #clickLocation = {};

  constructor() {
    this.#initial(); //gets navigator location and displays a map
    typeSelector.addEventListener("change", function (e) {
      cadence.forEach((el) => el.classList.toggle("d-none"));
      gain.forEach((el) => el.classList.toggle("d-none"));
    });
    form.addEventListener("submit", this.#putMarkOnMap.bind(this));
  }
  #initial() {
    navigator.geolocation.getCurrentPosition(
      this.#renderMap.bind(this),

      function () {
        alert("Couldin't get your location");
      }
    );
  }
  #renderMap(location) {
    let zoom = 13;
    let { latitude: lat, longitude: long } = location.coords;
    this.#map = L.map("map").setView([lat, long], zoom);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    this.#map.on("click", this.#mapClick.bind(this));
  }

  #mapClick(e) {
    console.log(e, this);

    form.classList.remove("d-none");
    this.#clickLocation.lat = e.latlng.lat;
    this.#clickLocation.long = e.latlng.lng;
    console.log(this.#clickLocation);
  }
  #putMarkOnMap(e, msg = `A pretty CSS popup.<br> Easily customizable.`) {
    e.preventDefault();

    L.marker([this.#clickLocation.lat, this.#clickLocation.long])
      .addTo(this.#map)
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

    this.#clearInput();
    !form.classList.contains("d-none") && form.classList.add("d-none");
  }
  #clearInput() {
    document.querySelectorAll("input").forEach((el) => {
      el.value = "";
    });
  }
}
/*********************************STARTING POINT*********************************/
let app = new App();
