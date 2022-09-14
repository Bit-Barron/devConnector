import axios from 'axios';
import { setAlert } from './alert';
import { url } from '../utils/constants';

import {
  ADD_POST,
  DELETE_POST,
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from './types';

// Get posts

export const getPosts = () => async (dispatch: any) => {
  try {
    const res = await axios.get(`${url}api/posts`);

    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err: any) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// add like
export const addLike = (id: any) => async (dispatch: any) => {
  try {
    const res = await axios.put(`${url}api/posts/like/${id}`);
    console.log(res.data);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err: any) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const removeLike = (id: any) => async (dispatch: any) => {
  try {
    const res = await axios.put(`${url}api/posts/unlike/${id}`);
    console.log(res.data);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err: any) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const deletePost = (id: any) => async (dispatch: any) => {
  try {
    await axios.put(`${url}api/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: id,
    });

    dispatch(setAlert('Post Removed', 'success'));
  } catch (err: any) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addPost = (formData: any) => async (dispatch: any) => {
  try {
    const res = await axios.post(`${url}api/posts/`, formData);
    console.log(res.data);

    dispatch({ type: ADD_POST, payload: res.data });
    dispatch(setAlert('Post Created', 'success'));
  } catch (err: any) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const getPost = (id: any) => async (dispatch: any) => {
  try {
    const res = await axios.get(`${url}api/posts/${id}`);

    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (err: any) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addComment =
  (postId: any, formData: any) => async (dispatch: any) => {
    try {
      const res = await axios.post(
        `${url}api/posts/comment/${postId}`,
        formData
      );

      console.log(res.data);

      dispatch({
        type: ADD_COMMENT,
        payload: res.data,
      });
      dispatch(setAlert('Comment Added', 'success'));
    } catch (err: any) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

export const deleteComment =
  (postId: any, commentId: any) => async (dispatch: any) => {
    try {
      await axios.delete(`${url}api/posts/comment/${postId}/${commentId}`);
      dispatch({ type: REMOVE_COMMENT, payload: commentId });
      dispatch(setAlert('Coment Removed', 'success'));
    } catch (err: any) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };
