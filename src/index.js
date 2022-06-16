const axios = require("axios");

const restaurantsList = document.querySelector("#restaurants-list");
const usersList = document.querySelector("#users-list");
const reservationsList = document.querySelector("#reservations-list");

window.addEventListener("hashchange", async () => {
  renderUsers();
  await fetchReservations();
  renderReservations();
  renderRestaurants();
});

// window.addEventListener("hashchange", () => {
//   renderUsers();
// });

const state = {};

const fetchUsers = async () => {
  const response = await axios.get("/api/users");
  state.users = response.data;
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

// window.addEventListener("hashchange", renderUsers);

restaurantsList.addEventListener("click", async (ev) => {
  if (ev.target.tagName === "LI") {
    const restaurantId = ev.target.getAttribute("data-id");
    const userId = window.location.hash.slice(1);
    const response = await axios.post(`/api/users/${userId}/reservations`, {
        restaurantId
    });
    state.reservations.push(response.data)
    renderRestaurants()
    renderReservations()
  }
});

reservationsList.addEventListener("click", async (ev) => {
    if (ev.target.tagName === "LI") {
      const reservationId = ev.target.getAttribute("data-id")*1;
      await axios.delete(`/api/reservations/${reservationId}`);
      state.reservations = state.reservations.filter(reservation => reservation.id !== reservationId)
      renderRestaurants()
      renderReservations()
    }
  });

const fetchRestaurants = async () => {
  const response = await axios.get("/api/restaurants");
  state.restaurants = response.data;
};

const fetchReservations = async () => {
  const id = window.location.hash.slice(1);
  const response = await axios.get(`/api/users/${id}/reservations`);
  state.reservations = response.data;
};

const renderRestaurants = () => {
  const html = state.restaurants
    .map((restaurant) => {
      const count = state.reservations.filter(
        (reservation) => reservation.restaurantId === restaurant.id
      ).length;
      return `
            <li data-id='${restaurant.id}'>
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
