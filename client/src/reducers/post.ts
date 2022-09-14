/* eslint-disable import/no-anonymous-default-export */
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory';
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

export default function (
  state: any = initialState,
  action: { type: any; payload: any }
) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case DELETE_POST:
        return {
            ...state,
            posts: state.post.filter((post: any) => post._id !== payload),
            loading: false
        }
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case UPDATE_LIKES:
      return {
        ...state,
        //@ts-ignore
        posts: state.posts.map((post) =>
          post._id === payload.id ? { ...post, likes: payload.likes } : post
        ),
        loading: false,
      };
    default:
      return state;
  }
}
