import { IImage, IPost } from "../../models/post";
import { IUser } from "../../models/user";
import { getFollowerPosts, getPosts, getPopularPosts } from "../../services/posts";
import { SET_ERROR, START_LOADING, STOP_LOADING } from "../ui/actions";

export const SET_POSTS = "SET_POSTS"
export const CLEAR_POSTS = "CLEAR_POSTS"

export interface SetPostsAction {
    type: typeof SET_POSTS,
    payload: IImage[]
}

export interface ClearPostsAction {
    type: typeof CLEAR_POSTS
}

export type PostsActionTypes = SetPostsAction | ClearPostsAction

export const loadPosts = (userId: string) => (dispatch: any) => {
    dispatch({type: START_LOADING});
    getFollowerPosts(userId).then(posts => {
        dispatch({type: SET_POSTS, payload: posts});
        dispatch({type: STOP_LOADING});
    }).catch(err => {
        dispatch({type: STOP_LOADING});
        dispatch({type: SET_ERROR, payload: err})
    })
  };

export const loadPopularPosts = (userId: string) => (dispatch: any) => {
    dispatch({type: START_LOADING});
    getPopularPosts(userId).then(posts => {
        dispatch({type: SET_POSTS, payload: posts});
        dispatch({type: STOP_LOADING});
    }).catch(err => {
        dispatch({type: STOP_LOADING});
        dispatch({type: SET_ERROR, payload: err})
    })
}