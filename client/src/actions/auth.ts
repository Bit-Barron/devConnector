import axios from 'axios';
import { setAlert } from './alert';
import { url } from '../utils/constants';

import { REGISTER_SUCCES, REGISTER_FAIL } from './types';

//Register User

export const register =
  ({ name, email, password }: any) =>
  async (dispatch: any) => {
    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post(`${url}api/users`, body);

      dispatch({
        type: REGISTER_SUCCES,
        payload: res.data,
      });
    } catch (err: any) {
      const errors: any = err.response.data;

      if (errors) {
        errors.forEach((error: { msg: any }) =>
          dispatch(setAlert(error.msg, 'danger'))
        );
      }
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  };
