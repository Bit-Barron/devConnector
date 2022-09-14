import axios from 'axios';
import { setAlert } from './alert';
import { url } from '../utils/constants';

import { DELETE_POST, GET_POSTS, POST_ERROR, UPDATE_LIKES } from './types';

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
      const res = await axios.put(`${url}api/posts/${id}`);
      console.log(res.data);
  
      dispatch({
        type: DELETE_POST,
        payload: id
      });
      
      dispatch(setAlert('Post Removed', 'success'))
    } catch (err: any) {
       dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };
  
export const addPost = (id: any) => async (dispatch: any) => {
    try {
      const res = await axios.put(`${url}api/posts/${id}`);
      console.log(res.data);
  
      dispatch({
        type: DELETE_POST,
        payload: id
      });
      
      dispatch(setAlert('Post Removed', 'success'))
    } catch (err: any) {
       dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };
  