import { START_LOADING, STOP_LOADING, SET_ERROR, CLEAR_ERROR, UIActionTypes, INC_NOTIFICATIONS, CLEAR_NOTIFICATIONS } from "./actions"

export interface UIState{
    loading: boolean,
    error: string,
    notifications: number
}

const initialState: UIState = {
    error: "",
    loading: false,
    notifications: 0
}

export default (state = initialState, action: UIActionTypes) => {
    switch(action.type){
        case START_LOADING:
            return {...state, loading: true}
        case STOP_LOADING:
            return {...state, loading: false}
        case SET_ERROR:
            return {...state, error: action.payload}
        case CLEAR_ERROR:
            return {...state, error: ''}
        case INC_NOTIFICATIONS:
            return {...state, notifications: state.notifications + 1}
        case CLEAR_NOTIFICATIONS:
            return {...state, notifications: 0}
        default:
            return {...state}
    }
}