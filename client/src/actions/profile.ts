import axios from 'axios';
import { setAlert } from './alert';
import { url } from '../utils/constants';

import {
  ACCOUNT_DELETED,
  CLEAR_PROFILE,
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  GET_PROFILES,
  GET_REPOS,
} from './types';

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

// Get all profiles

export const getProfiles = () => async (dispatch: any) => {
  dispatch({ type: CLEAR_PROFILE });

  try {
    const res = await axios.get(`${url}api/profile`);

    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err: any) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const getProfileById = (userId: any) => async (dispatch: any) => {
  try {
    const res = await axios.get(`${url}api/profile/user/${userId}`);

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

export const getGithubRepos = (username: any) => async (dispatch: any) => {
  try {
    const res = await axios.get(`${url}api/profile/github${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  } catch (err: any) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create or update profile

export const createProfile =
  (formData: any, navigate: any, edit = false) =>
  async (dispatch: any) => {
    try {
      const config: object = {
        headers: { 'Content-Type': 'application/json' },
      };

      const res = await axios.post(`${url}api/profile`, formData, config);

      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });

      dispatch(
        setAlert(edit ? 'Profile Updated' : 'Profile created', 'success')
      );

      if (!edit) {
        return navigate('/dashboard');
      }
    } catch (err: any) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error: any) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

export const addExperience =
  (formData: any, navigate: any) => async (dispatch: any) => {
    try {
      const config: object = {
        headers: { 'Content-Type': 'application/json' },
      };

      const res = await axios.put(
        `${url}api/profile/experience`,
        formData,
        config
      );

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });

      dispatch(setAlert('Experience added', 'success'));

      return navigate('/dashboard');
    } catch (err: any) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error: any) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

export const addEducation =
  (formData: any, navigate: any) => async (dispatch: any) => {
    try {
      const config: object = {
        headers: { 'Content-Type': 'application/json' },
      };

      const res = await axios.put(
        `${url}api/profile/education`,
        formData,
        config
      );

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });

      dispatch(setAlert('Education Added', 'success'));

      return navigate('/dashboard');
    } catch (err: any) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error: any) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

// Delete Experience

export const deleteExperience = (id: any) => async (dispatch: any) => {
  try {
    const res = await axios.delete(`${url}api/profile/experience/${id}`);
    console.log(res.data);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert('Experience removed', 'success'));
  } catch (err: any) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete education

export const deleteEducation = (id: any) => async (dispatch: any) => {
  try {
    const res = await axios.delete(`${url}api/profile/education/${id}`);
    console.log(res.data);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert('Education removed', 'success'));
  } catch (err: any) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete account & profile

export const deleteAccount = () => async (dispatch: any) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await axios.delete(`${url}api/profile`);

      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });

      dispatch(setAlert('Your account has been permanantyl deleted'));
    } catch (err: any) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
