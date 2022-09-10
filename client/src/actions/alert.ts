import { v4 as uuid } from 'uuid';
import { REMOVE_ALERT, SET_ALERT } from './types';

export const setAlert: any =
  (msg: any, alertType: any, timeout = 5000) =>
  (dispatch: (arg0: { type: any }) => void) => {
    const id = uuid();
    dispatch({
      type: SET_ALERT,
      //@ts-ignore
      payload: { msg, alertType, id },
    });

    //@ts-ignore
    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };
