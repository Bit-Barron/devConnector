import axios from 'axios';
import { setAlert } from './alert';
import { url } from '../utils/constants';

import {
  REGISTER_SUCCES,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
} from './types';

// Load User
export const loadUser = () => async (dispatch: any) => {
    
}

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
