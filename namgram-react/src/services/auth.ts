import { ISignin, ISignup } from "../models/auth";
export function signin(user: ISignin): Promise<null> {
    return new Promise<null>(resolve => setTimeout(resolve, 2000));
}

export function signup(user: ISignup): Promise<null> {
    return new Promise<null>(resolve => setTimeout(resolve, 2000));
}