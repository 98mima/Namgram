export interface ISignin {
    email: string,
    password: string
}

export interface ISigninRes {
    AuthToken: string,
    Success: boolean
}

export interface ISignup {
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
}

export interface ISignupRes {
    AuthToken: string,
    Success: boolean
}

export interface IAuth {
    id: string
}