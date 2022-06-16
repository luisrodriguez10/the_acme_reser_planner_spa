const axios = require("axios");

const restaurantsList = document.querySelector("#restaurants-list");
const usersList = document.querySelector("#users-list");
const reservationsList = document.querySelector("#reservations-list");

const state = {};

const fetchUsers = async () => {
  const response = await axios.get("/api/users");
  state.users = response.data;
};

const renderUsers = () => {
  const html = state.users
    .map((user) => {
      return `
            <li>
                <a href='#${user.id}'>
                    ${user.name}
                </a>
            </li>
        `;
    })
    .join("");
    usersList.innerHTML = html
};

const fetchRestaurants = async () => {
  const response = await axios.get("/api/restaurants");
  state.restaurants = response.data;
};

const renderRestaurants = () => {
  const html = state.restaurants
    .map((restaurant) => {
      return `
            <li>
                ${restaurant.name}
            </li>
        `;
    })
    .join("");
    restaurantsList.innerHTML = html
};

const start = async () => {
  await fetchUsers();
  await fetchRestaurants();
  renderUsers();
  renderRestaurants();
};

start();
