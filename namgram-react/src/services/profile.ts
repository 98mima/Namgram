import axios from "axios";
import { IProfile, IUser } from "../models/user";

export async function getProfile(userId: string) {
    return axios.get<{message: string, Data: IUser}>(`person/byId/${userId}`)
        .then(res => {
            const {id, birthday, lastname, name, username} = res.data.Data;
            const profile: IProfile = 
            {id, birthday, lastname, name, username, followers:[], following:[], posts:[]};
            return profile;
        });
}

export async function getFollowers(userId: string) {
    return axios.get<{message: string, Data: IUser[]}>(`person/getFollowers/${userId}`)
        .then(res => {
            return res.data.Data;
        });
}

export async function getFollowing(userId: string) {
    return axios.get<{message: string, Data: IUser[]}>(`person/getFollowing/${userId}`)
        .then(res => {
            return res.data.Data;
        });
}