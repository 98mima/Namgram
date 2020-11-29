import { IPost } from "../../models/post";
import { getPosts } from "../../services/posts";
import { SET_ERROR, START_LOADING, STOP_LOADING } from "../ui/actions";

export const SET_POSTS = "SET_POSTS"
export const CLEAR_POSTS = "CLEAR_POSTS"

export interface SetPostsAction {
    type: typeof SET_POSTS,
    payload: IPost[]
}

export interface ClearPostsAction {
    type: typeof CLEAR_POSTS
}

export type PostsActionTypes = SetPostsAction | ClearPostsAction

export const loadPosts = () => (dispatch: any) => {
    dispatch({type: START_LOADING});
    getPosts("1").then(posts => {
            dispatch({type: SET_POSTS, payload: posts});
            dispatch({type: STOP_LOADING});
        }
    ).catch(err => {
        dispatch({type: STOP_LOADING});
        dispatch({type: SET_ERROR, payload: err})
    })
  };