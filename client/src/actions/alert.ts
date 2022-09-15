import { v4 as uuid } from 'uuid';
import { REMOVE_ALERT, SET_ALERT } from './types';

export const setAlert: any =
  (msg: string, alertType: string, timeout = 5000) =>
  (dispatch: (arg0: { type: any }) => void) => {
    const id: any = uuid();
    dispatch({
      type: SET_ALERT,

      payload: { msg, alertType, id}
    } as any);
    setTimeout(
      () => dispatch({ type: REMOVE_ALERT, payload: id } as any),
      timeout
    );
  };
