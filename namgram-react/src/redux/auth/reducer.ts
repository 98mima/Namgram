import { IAuth } from "../../models/auth"
import { AuthActionTypes, CLEAR_AUTH, CLEAR_NOTIFICATIONS, INC_NOTIFICATIONS, SET_AUTH, SET_SOCKET } from "./actions"

export interface AuthState{
    auth: IAuth | null,
    socket: SocketIOClient.Socket | null,
    notifications: number
}

const initialState: AuthState = {
    auth: null,
    socket: null,
    notifications: 0
}

export default (state = initialState, action: AuthActionTypes) => {
    switch(action.type){
        case SET_AUTH:
            return {...state, auth: action.payload}
        case CLEAR_AUTH:
            return {...state, auth: null}
        case SET_SOCKET:
            return {...state, socket: action.payload}
        case INC_NOTIFICATIONS:
            return {...state, notifications: state.notifications + 1}
        case CLEAR_NOTIFICATIONS:
            return {...state, notifications: 0}
        default:
            return {...state}
    }
}