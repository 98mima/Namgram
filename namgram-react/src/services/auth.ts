import axios, {AxiosError} from "axios"

import { ISignin, ISigninRes, ISignup, ISignupRes } from "../models/auth";
export async function signin(user: ISignin){
    return axios.post<ISigninRes>("auth/login", user).then(d => d.data);
}

export async function signup(user: ISignup) {
    return axios.post<ISignupRes>("auth/register", user).then(d => d.data);
}