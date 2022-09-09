import axios from 'axios';
import { setAlert } from './alert';
import {url} from '../utils/constants'

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
