import axios from "axios"

import { ISignin, ISignup } from "../models/auth";
export function signin(user: ISignin) {
    const a = {
        "email": "zlatkovnik@gmail.com",
        "password": "12345678"
    };
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.get("http://localhost:8080/person/byEmail/zlatkovnik@gmail.com")
        .then(d => console.log(d.data))
        .catch(console.log);
}

export function signup(user: ISignup): Promise<null> {
    return new Promise<null>(resolve => setTimeout(resolve, 2000));
}