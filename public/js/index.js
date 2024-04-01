/* eslint-disable */

import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';

// elements
const form = document.querySelector('.form');
const map = document.getElementById('map');
const btnLogout = document.querySelector('.nav__el--logout');

// delegations
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (map) displayMap(JSON.parse(map.dataset.locations));

if (btnLogout) {
  btnLogout.addEventListener('click', logout);
}
