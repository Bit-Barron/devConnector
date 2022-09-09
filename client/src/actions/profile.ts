import axios from 'axios';
import { setAlert } from './alert';

import { GET_PROFILE, PROFILE_ERROR } from './types';

export const getCurrentProfile =
  () => async (dispatch: (arg0: { type: string; payload: any }) => void) => {
    try {
      const res = await axios.get('/api/profile/me');

      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
    } catch (err: any) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.statuse },
      });
    }
  };
