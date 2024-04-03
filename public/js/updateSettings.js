/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const saveSettings = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
      data: {
        name: name,
        email: email,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Updated successfully!');
    }

    console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
