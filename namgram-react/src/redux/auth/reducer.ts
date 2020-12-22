import { IAuth } from "../../models/auth"
import { AuthActionTypes, CLEAR_AUTH, SET_AUTH } from "./actions"

export interface AuthState{
    auth: IAuth | null
}

const initialState: AuthState = {
    auth: null
}

export default (state = initialState, action: AuthActionTypes) => {
    switch(action.type){
        case SET_AUTH:
            return {...state, auth: action.payload}
        case CLEAR_AUTH:
            return {...state, auth: null}
        default:
            return {...state}
    }
}