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
let actionsCenter = document.querySelector(".action-center");
let resetBtn = document.querySelector(".btn-danger");

/*********************************CLASSES*********************************/
class Workout {
  distance;
  duration;
  type;
  date = new Date();
  id = this.date.getTime().toString().slice(-10);
  coord = {};
  constructor(distance, duration, lat, long) {
    this.distance = distance;
    this.duration = duration;
    this.coord.lat = lat;
    this.coord.long = long;
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
    this.#getStoredData();
    typeInput.addEventListener("change", function (e) {
      cadence.forEach((el) => el.classList.toggle("d-none"));
      gain.forEach((el) => el.classList.toggle("d-none"));
    });
    form.addEventListener("submit", this.#putMarkOnMap.bind(this));
    actionsCenter.addEventListener("click", this.#moveTo.bind(this));
    window.addEventListener(
      "beforeunload",
      this.#updateLocalStorage.bind(this)
    );
    resetBtn.addEventListener("click", this.#resetApp);
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
    this.#displayStored();
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
  #addCycling(msg, workout) {
    let html = `
                    <div class="col-12 cycling border-start border-5 " data-id='${
                      workout.id
                    }'>
                        <h2 class="fs-5 mb-3">${msg.slice(5)}</h2>
                        <div class="row row-cols-sm-4 row-cols-2 text-center gx-1">
                            <div class="col">🚴‍♀️ ${
                              workout.distance
                            } <span class="sub"> KM </span></div>
                            <div class="col">⏱ ${
                              workout.duration
                            } <span class="sub"> MIN </span></div>
                            <div class="col">⚡️ ${workout.speed.toFixed(
                              1
                            )} <span class="sub"> KM/H </span></div>
                            <div class="col text-center">⛰ ${
                              workout.elvGain
                            } <span class="sub"> M </span></div>
                        </div>
                    </div>`;
    form.insertAdjacentHTML("afterend", html);
  }
  #addRunning(msg, workout) {
    let html = `
                    <div class="col-12 running border-start border-5" data-id='${
                      workout.id
                    }'>
                        <h2 class="fs-5 mb-3">${msg.slice(5)}</h2>
                        <div class="row row-cols-sm-4 row-cols-2 text-center gx-1 ">
                            <div class="col">🚴‍♀️ ${
                              workout.distance
                            } <span class="sub"> KM </span></div>
                            <div class="col">⏱ ${
                              workout.duration
                            } <span class="sub"> MIN </span></div>
                            <div class="col">⚡️ ${
                              workout.pace
                            } <span class="sub"> MIN/KM </span></div>
                            <div class="col text-center">🦶🏼
                                ${
                                  workout.cadence
                                } <span class="sub"> SPM </span></div>
                        </div>
                    </div>`;
    form.insertAdjacentHTML("afterend", html);
  }
  #generateMSG(date, type) {
    let formattedDate = new Intl.DateTimeFormat(navigator.language, {
      day: "numeric",
      month: "long",
    }).format(new Date(date));

    let msg = `${
      type === "cycling" ? "🚴‍♀️ Cycling" : "🏃‍♂️ Running"
    } on ${formattedDate} `;
    return msg;
  }
  #addWorkout(Workout) {
    let msg = this.#generateMSG(Workout.date, Workout.type);

    Workout.type === "cycling"
      ? this.#addCycling(msg, Workout)
      : this.#addRunning(msg, Workout);

    this.#markLocation.call(
      this,
      Workout.coord.lat,
      Workout.coord.long,
      Workout.type,
      Workout.date
    );
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
    this.#addWorkout.call(this, Workout);
    this.#clearInput();
    !form.classList.contains("hidden") && form.classList.add("hidden");
    form.classList.add("d-none");
  }
  #markLocation(lat, long, type, date) {
    let msg = this.#generateMSG(date, type);
    L.marker([lat, long])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${type} border-start border-5 rounded-2`,
        })
      )
      .setPopupContent(msg)
      .openPopup();
  }
  #clearInput() {
    document.querySelectorAll("input").forEach((el) => {
      el.value = "";
    });
  }
  #moveTo(el) {
    let par = el.target.closest(".col-12.border-5");
    if (!par) return;
    let id = par.getAttribute("data-id");
    let targetWorkout = this.#workouts.find((el) => el.id === id);
    this.#map.setView([targetWorkout.coord.lat, targetWorkout.coord.long], 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }
  #updateLocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this.#workouts));
  }
  #getStoredData() {
    this.#workouts = JSON.parse(localStorage.getItem("workouts"));
    if (this.#workouts) return;
    this.#workouts = [];
  }
  #displayStored() {
    this.#workouts.forEach((el) => this.#addWorkout(el));
  }
  #resetApp() {
    location.reload();
    localStorage.clear();
  }
}
/*********************************ENTRY POINT*********************************/
let app = new App();
