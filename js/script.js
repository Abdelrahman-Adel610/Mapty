"use strict";
/*********************************ELEMENTS*********************************/
let cadence = document.querySelectorAll(".run-input");
let gain = document.querySelectorAll(".cylce-input");
let form = document.querySelector(".form");
let typeInput = document.querySelector("select");
let distaceInput = document.querySelector("#Distace");
let durationInput = document.querySelector("#Duration");
let cadenceInput = document.querySelector("#Cadence");
let elevInput = document.querySelector("#ElevGain");
/*********************************CLASSES*********************************/
class Workout {
  distance;
  duration;
  type;
  date = new Date();
  #id = this.date.getTime().toString().slice(-10);
  #coord = {};
  constructor(distance, duration, lat, long) {
    this.distance = distance;
    this.duration = duration;
    this.#coord.lat = lat;
    this.#coord.long = long;
  }
}
class running extends Workout {
  cadence;
  constructor(distance, duration, cadence, lat, long) {
    super(distance, duration, lat, long);
    this.type = "running";
    this.cadence = cadence;
    this.clacPace();
  }
  clacPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class cycling extends Workout {
  elvGain;
  constructor(distance, duration, elvGain, lat, long) {
    super(distance, duration, lat, long);
    this.type = "cycling";
    this.elvGain = elvGain;
    this.clacSpeed();
  }
  clacSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
class App {
  #map;
  #clickLocation = {};
  #workouts = [];

  constructor() {
    this.#initial(); //gets navigator location and displays a map
    typeInput.addEventListener("change", function (e) {
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
    form.classList.remove("d-none");
    setTimeout(() => form.classList.remove("hidden"), 0.1);
    this.#clickLocation.lat = e.latlng.lat;
    this.#clickLocation.long = e.latlng.lng;
  }
  #putMarkOnMap(e) {
    e.preventDefault();

    let type = typeInput.value;
    let distace = +distaceInput.value;
    let duration = +durationInput.value;
    let cadence = +cadenceInput.value;
    let elev = +elevInput.value;

    if (
      !(
        distace > 0 &&
        duration > 0 &&
        ((cadence > 0 && type === "Running") ||
          (elev > 0 && type === "Cycling"))
      )
    )
      return alert("You should enter positve values");
    let Workout =
      type === "Running"
        ? new running(
            distace,
            duration,
            cadence,
            this.#clickLocation.lat,
            this.#clickLocation.long
          )
        : new cycling(
            distace,
            duration,
            elev,
            this.#clickLocation.lat,
            this.#clickLocation.long
          );
    this.#workouts.push(Workout);
    let formattedDate = new Intl.DateTimeFormat(navigator.language, {
      day: "numeric",
      month: "long",
    }).format(Workout.date);
    let msg = `${
      type === "Cycling" ? "🚴‍♀️ Cycling" : "🏃‍♂️ Running"
    } on ${formattedDate} `;
    L.marker([this.#clickLocation.lat, this.#clickLocation.long])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${Workout.type} border-start border-5 rounded-2`,
        })
      )
      .setPopupContent(msg)
      .openPopup();

    this.#clearInput();
    !form.classList.contains("hidden") && form.classList.add("hidden");
    form.classList.add("d-none");
  }
  #clearInput() {
    document.querySelectorAll("input").forEach((el) => {
      el.value = "";
    });
  }
}
/*********************************STARTING POINT*********************************/
let app = new App();
