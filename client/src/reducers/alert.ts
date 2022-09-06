/* eslint-disable import/no-anonymous-default-export */
import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState: any = [];

export default function (state = initialState, action: any) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return [...state, action.payload];
    case REMOVE_ALERT:
      return state.filter((alert: { id: any }) => alert.id !== payload);
    default:
      return state;
  }
}
