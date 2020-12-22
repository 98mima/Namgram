export interface ISignin{
    email: string,
    password: string
}

export interface ISigninRes{
    AuthToken: string,
    Success: boolean
}

export interface ISignup{
    username: string,
    email: string,
    password: string,
    confirmPassword: string
}

export interface ISignupRes{
    AuthToken: string,
    Success: boolean
}

export interface IAuth{
    id: string
}