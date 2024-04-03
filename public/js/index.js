/* eslint-disable */

import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { saveSettings } from './updateSettings';

// elements
const form = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');
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

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    console.log(name, email);
    saveSettings(name, email);
  });
}
