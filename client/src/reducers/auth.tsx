/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { REGISTER_SUCCES, REGISTER_FAIL } from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state = initialState, action: any) {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCCES:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null, 
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}
