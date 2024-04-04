/* eslint-disable */

import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';

// elements
const form = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.getElementsByClassName('form-user-password');
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

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btnSavePassword = document.querySelector('.btn--save-password');
    btnSavePassword.innerHTML = 'Updating...';

    const password = document.getElementById('password-current').value;
    const passwordUpdate = document.getElementById('password').value;
    const passwordUpdateConfirm = document.getElementById('password-confirm').value;

    updateSettings({ password, passwordUpdate, passwordUpdateConfirm }, 'password');

    console.log('Password is updated');

    btnSavePassword.textContent = 'SAVE PASSWORD';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    console.log(name, email);
    updateSettings({ name, email }, 'data');
  });
}
