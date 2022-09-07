import { v4 as uuid } from 'uuid';
import { REMOVE_ALERT, SET_ALERT } from './types';

export const setAlert =
  (msg: any, alertType: any) => (dispatch: (arg0: { type: any }) => void) => {
    const id = uuid();
    dispatch({
      type: SET_ALERT,
      //@ts-ignore
      payload: { msg, alertType, id },
    });

    //@ts-ignore
    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), 5000);
  };
