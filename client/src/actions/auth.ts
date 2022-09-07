import axios from 'axios';
import { setAlert } from './alert';
import { url } from '../utils/constants';

import {
  REGISTER_SUCCES,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser: any = () => async (dispatch: any) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get(`${url}api/auth`);

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//Register User

export const register =
  ({ name, email, password }: any) =>
  async (dispatch: any) => {
    const body = JSON.stringify({ name, email, password });

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    try {
      const res = await axios.post(`${url}api/users`, body, config);

      console.log(res.data);

      dispatch({
        type: REGISTER_SUCCES,
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (err: any) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error: any) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

// Login user

export const login =
  ({ name, email, password }: any) =>
  async (dispatch: any) => {
    const body = JSON.stringify(email, password);

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    try {
      const res = await axios.post(`${url}api/auth`, body, config);

      console.log(res.data);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (err: any) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error: any) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: LOGIN_FAIL,
      });
    }
  };
