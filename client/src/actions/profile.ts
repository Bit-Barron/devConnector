import axios from 'axios';
import { setAlert } from './alert';
import { url } from '../utils/constants';

import { GET_PROFILE, PROFILE_ERROR } from './types';

// Get current users profile
export const getCurrentProfile = () => async (dispatch: any) => {
  try {
    const res = await axios.get(`${url}api/profile/me`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err: any) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create or update profile

export const createProfile =
  (formData: any, history: any, edit = false) =>
  async (dispatch: any) => {
    try {
      const config: object = {
        headers: { 'Content-Type': 'application/json' },
      };

      const res = await axios.post(`${url}api/profile`, formData, config);

      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });

      dispatch(setAlert(edit ? 'Profile Updated' : 'Profile created'));

      if (!edit) {
        return history.push('/Dashboard');
      }
    } catch (err: any) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error: any) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };
