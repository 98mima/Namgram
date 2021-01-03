import { IPost } from "./post";

export interface IUser{
    birthday: Date,
    password: string,
    name: string,
    id: string,
    email: string,
    lastname: string,
    username: string
}

export interface IProfile {
    id: string,
    username: string,
    name: string,
    lastname: string,
    birthday: Date,
    followers: IUser[],
    following: IUser[],
    posts: IPost[]
}