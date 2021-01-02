import { IProfile, IUser } from "../../models/user";
import { getPosts } from "../../services/posts";
import { getFollowers, getFollowing, getProfile } from "../../services/profile";
import { SET_ERROR, START_LOADING, STOP_LOADING } from "../ui/actions";
import { AxiosError } from "axios";

export const SET_PROFILE = "SET_PROFILE"
export const CLEAR_PROFILE = "CLEAR_PROFILE"

export interface SetProfileAction {
    type: typeof SET_PROFILE,
    payload: IProfile
}

export interface ClearProfileAction {
    type: typeof CLEAR_PROFILE
}

export type ProfileActionTypes = SetProfileAction | ClearProfileAction

export const loadProfile = (userId: string) => (dispatch: any) => {
    dispatch({type: START_LOADING});
    Promise.all([getProfile(userId), getFollowers(userId), getFollowing(userId), getPosts(userId)])
    .then(res => {
        const profile: IProfile = {
            ...res[0],
            followers: res[1],
            following: res[2],
            posts: res[3]
        }
        dispatch({type: SET_PROFILE, payload: profile});
        dispatch({type: STOP_LOADING});
    }).catch((err: AxiosError) => {
        console.log(err);
        dispatch({type: STOP_LOADING});
        dispatch({type: SET_ERROR, payload: err.response?.data})
    })
};