const api = require("./api");
const state = {};
const restaurantsList = document.querySelector("#restaurants-list");
const usersList = document.querySelector("#users-list");
const reservationsList = document.querySelector("#reservations-list");
const form = document.querySelector("form");

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const input = document.querySelector("input");
  const name = input.value;
  const user = await api.createUser({name})
  state.users.push(user);
  window.location.hash = user.id;
  input.value = "";
});

window.addEventListener("hashchange", async () => {
  renderUsers();
  await fetchReservations();
  renderReservations();
  renderRestaurants();
});

const fetchUsers = async () => {
  const response = await api.fetchUsers();
  state.users = response.data;
};

const fetchRestaurants = async () => {
  const response = await api.fetchRestaurants();
  state.restaurants = response.data;
};

const fetchReservations = async () => {
  const id = window.location.hash.slice(1);
  if (id) {
    const response = await api.fetchReservations(id);
    state.reservations = response.data;
  } else {
    state.reservations = [];
  }
};

const renderUsers = () => {
  const id = window.location.hash.slice(1) * 1;
  const html = state.users
    .map((user) => {
      return `
            <li class='${user.id === id ? "selected" : ""}'>
                <a href='#${user.id}'>
                    ${user.name}
                </a>
            </li>
        `;
    })
    .join("");
  usersList.innerHTML = html;
};

const renderRestaurants = () => {
  const html = state.restaurants
    .map((restaurant) => {
      const count = state.reservations.filter(
        (reservation) => reservation.restaurantId === restaurant.id
      ).length;
      return `
              <li data-id='${restaurant.id}' class='${
        count > 0 ? "selected" : ""
      }'>
                  ${restaurant.name} (${count})
              </li>
          `;
    })
    .join("");
  restaurantsList.innerHTML = html;
};

const renderReservations = () => {
  const html = state.reservations
    .map((reservation) => {
      const restaurant = state.restaurants.find(
        (restaurant) => restaurant.id === reservation.restaurantId
      );
      return `
                <li data-id='${reservation.id}'>
                    ${restaurant.name}
                    (${new Date(reservation.createdAt).toLocaleString()})
                </li>
            `;
    })
    .join("");
  reservationsList.innerHTML = html;
};

restaurantsList.addEventListener("click", async (ev) => {
  if (ev.target.tagName === "LI") {
    const restaurantId = ev.target.getAttribute("data-id");
    const userId = window.location.hash.slice(1);
    if (!userId) {
      return;
    }
    const reservation = await api.createReservation({userId, restaurantId})
    state.reservations.push(reservation);
    renderRestaurants();
    renderReservations();
  }
});

reservationsList.addEventListener("click", async (ev) => {
  if (ev.target.tagName === "LI") {
    const reservationId = ev.target.getAttribute("data-id") * 1;
    await api.deleteReservation(reservationId)
    state.reservations = state.reservations.filter(
      (reservation) => reservation.id !== reservationId
    );
    renderRestaurants();
    renderReservations();
  }
});

const start = async () => {
  console.log("hello");
  await fetchUsers();
  await fetchRestaurants();
  await fetchReservations();
  renderUsers();
  renderRestaurants();
  renderReservations();
};

start();
