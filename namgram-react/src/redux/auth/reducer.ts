import { IAuth } from "../../models/auth"
import { AuthActionTypes, CLEAR_AUTH, SET_AUTH, SET_SOCKET } from "./actions"

export interface AuthState{
    auth: IAuth | null,
    socket: SocketIOClient.Socket | null
}

const initialState: AuthState = {
    auth: null,
    socket: null
}

export default (state = initialState, action: AuthActionTypes) => {
    switch(action.type){
        case SET_AUTH:
            return {...state, auth: action.payload}
        case CLEAR_AUTH:
            return {...state, auth: null}
        case SET_SOCKET:
            return {...state, socket: action.payload}
        default:
            return {...state}
    }
}